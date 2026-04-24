const { Transactions, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const { restoreMerchandiseStock } = require('../payments/stockHelper');

const ALLOWED_STATUSES = ['waiting', 'on process', 'on delivery', 'arrived', 'done', 'canceled', 'denied'];
const RELEASE_STATUSES = new Set(['canceled', 'denied']);

const UpdateTransactions = async (id, body) => {
  const { status } = body;

  if (status === undefined) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'Status must be provided for update',
    });
  }

  if (!ALLOWED_STATUSES.includes(status)) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: `Invalid status. Allowed: ${ALLOWED_STATUSES.join(', ')}`,
    });
  }

  const tx = await sequelize.transaction();
  try {
    const record = await Transactions.findByPk(id, {
      transaction: tx,
      lock: tx.LOCK.UPDATE,
    });

    if (!record) {
      throw new BaseError({ status: StatusCodes.NOT_FOUND, message: 'Transaction not found' });
    }

    if (record.status === status) {
      await tx.commit();
      return { status: StatusCodes.OK, message: 'No change', data: record };
    }

    const updates = { status };

    const releasingStock = RELEASE_STATUSES.has(status) && record.stockDeducted;
    if (releasingStock) {
      await restoreMerchandiseStock(
        { merchandiseId: record.merchandiseId, qty: record.qty },
        tx
      );
      updates.stockDeducted = false;
    }

    await record.update(updates, { transaction: tx });
    await tx.commit();

    return {
      status: StatusCodes.OK,
      message: releasingStock
        ? 'Transaction status updated, stock restored'
        : 'Transaction status updated',
    };
  } catch (error) {
    if (!tx.finished) await tx.rollback();
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to update transaction status: ${error.message || error}`,
    });
  }
};

module.exports = UpdateTransactions;
