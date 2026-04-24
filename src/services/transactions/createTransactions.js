const { Transactions, Merchandises, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const { decreaseMerchandiseStock } = require('../payments/stockHelper');
const fs = require('fs');
const path = require('path');

const CreateTransaction = async (body, files, uploadPath) => {
  const imageFile = files && files['payment'] ? files['payment'][0] : null;
  const { merchandiseId, username, email, noTelp, address, qty } = body;

  if (!merchandiseId || !username || !email || !noTelp || !address || qty == null) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'Merchandise ID, username, email, noTelp, address, and qty are required fields',
    });
  }

  const qtyNum = Number(qty);
  if (!Number.isInteger(qtyNum) || qtyNum <= 0) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'qty must be a positive integer',
    });
  }

  const transaction = await sequelize.transaction();
  try {
    const merchandise = await Merchandises.findByPk(merchandiseId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!merchandise) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Merchandise not found',
      });
    }

    await decreaseMerchandiseStock({ merchandiseId, qty: qtyNum }, transaction);

    const imageFileName = imageFile ? `${uploadPath}/public/images/transactions/${imageFile.filename}` : null;
    const grossAmount = Number(merchandise.price) * qtyNum;

    const newTransaction = await Transactions.create(
      {
        username,
        email,
        noTelp,
        address,
        merchandiseId,
        qty: qtyNum,
        payment: imageFileName,
        status: 'waiting',
        paymentMethod: 'manual',
        paymentStatus: 'pending',
        grossAmount,
        stockDeducted: true,
      },
      { transaction }
    );

    newTransaction.code = `IOM-${Date.now()}-${newTransaction.id}`;
    await newTransaction.save({ transaction });

    await transaction.commit();

    return {
      code: newTransaction.code,
      message: 'Transaction created successfully',
      transactionId: newTransaction.id,
    };
  } catch (error) {
    await transaction.rollback();

    if (files && imageFile) {
      const imageFilePath = path.join(__dirname, '../../public/images/transactions', imageFile.filename);
      if (fs.existsSync(imageFilePath)) {
        fs.unlinkSync(imageFilePath);
      }
    }

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create transaction: ${error.message || error}`,
    });
  }
};

module.exports = CreateTransaction;
