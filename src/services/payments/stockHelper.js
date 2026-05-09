const { StatusCodes } = require('http-status-codes');
const { Merchandises } = require('../../models');
const BaseError = require('../../schemas/responses/BaseError');

const decreaseMerchandiseStock = async ({ merchandiseId, qty }, transaction) => {
  const merchandise = await Merchandises.findByPk(merchandiseId, {
    transaction,
    lock: transaction ? transaction.LOCK.UPDATE : undefined,
  });
  if (!merchandise) {
    throw new BaseError({ status: StatusCodes.NOT_FOUND, message: 'Merchandise not found' });
  }
  if (merchandise.stock < qty) {
    throw new BaseError({ status: StatusCodes.BAD_REQUEST, message: 'Not enough stock available' });
  }
  await Merchandises.update(
    { stock: merchandise.stock - qty },
    { where: { id: merchandiseId }, transaction }
  );
};

const restoreMerchandiseStock = async ({ merchandiseId, qty }, transaction) => {
  const merchandise = await Merchandises.findByPk(merchandiseId, {
    transaction,
    lock: transaction ? transaction.LOCK.UPDATE : undefined,
  });
  if (!merchandise) return;
  await Merchandises.update(
    { stock: merchandise.stock + qty },
    { where: { id: merchandiseId }, transaction }
  );
};

module.exports = { decreaseMerchandiseStock, restoreMerchandiseStock };
