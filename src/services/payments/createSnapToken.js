const { Donations, Transactions, Merchandises, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const { snap } = require('../../utils/midtrans');

const createDonationSnapToken = async (payload) => {
  const { name, email, noWhatsapp, amount, donationType, facultyId, notification, nameIsHidden, isHambaAllah } = payload;

  if (!name || !email || !noWhatsapp || !amount) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'name, email, noWhatsapp, and amount are required',
    });
  }

  let donation;
  const tx = await sequelize.transaction();
  try {
    donation = await Donations.create({
      name,
      email,
      noWhatsapp,
      notification: notification || [],
      amount,
      nameIsHidden: nameIsHidden || false,
      isHambaAllah: isHambaAllah || false,
      options: {
        donationType: donationType || null,
        facultyId: facultyId || null,
        nameIsHidden: nameIsHidden || false,
        isHambaAllah: isHambaAllah || false,
      },
      bank: 'Midtrans',
      paymentMethod: 'midtrans',
      paymentStatus: 'pending',
      grossAmount: Math.round(amount),
    }, { transaction: tx });

    const orderId = `DONATION-${Date.now()}-${donation.id}`;
    await donation.update(
      { midtrans_order_id: orderId, midtransOrderId: orderId },
      { transaction: tx }
    );
    await tx.commit();

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(amount),
      },
      customer_details: {
        first_name: name,
        email,
        phone: noWhatsapp,
      },
      item_details: [{
        id: `donation-${donationType || 'umum'}`,
        price: Math.round(amount),
        quantity: 1,
        name: `Donasi IOM ITB${donationType ? ` — ${donationType}` : ''}`,
      }],
      callbacks: {
        notification: `${process.env.BASE_URL}/payments/notification`,
      },
    };

    const snapToken = await snap.createTransaction(parameter);
    return { token: snapToken.token, orderId };
  } catch (error) {
    if (tx && !tx.finished) await tx.rollback();
    if (donation) await donation.destroy().catch(() => {});
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create donation snap token: ${error.message}`,
    });
  }
};

const createTransactionSnapToken = async (payload) => {
  const { merchandiseId, username, email, noTelp, address, qty } = payload;

  if (!merchandiseId || !username || !email || !noTelp || !address || qty == null) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'merchandiseId, username, email, noTelp, address, and qty are required',
    });
  }

  const merchandise = await Merchandises.findByPk(merchandiseId);
  if (!merchandise) {
    throw new BaseError({ status: StatusCodes.NOT_FOUND, message: 'Merchandise not found' });
  }

  const grossAmount = Math.round(merchandise.price * qty);

  let newTransaction;
  const tx = await sequelize.transaction();
  try {
    newTransaction = await Transactions.create({
      username,
      email,
      noTelp,
      address,
      merchandiseId,
      qty,
      payment: null,
      status: 'waiting',
      paymentMethod: 'midtrans',
      paymentStatus: 'pending',
      grossAmount,
    }, { transaction: tx });

    const code = `IOM-${Date.now()}-${newTransaction.id}`;
    await newTransaction.update(
      { code, midtransOrderId: code },
      { transaction: tx }
    );
    await tx.commit();
    const parameter = {
      transaction_details: {
        order_id: code,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: username,
        email,
        phone: noTelp,
        shipping_address: { address },
      },
      item_details: [{
        id: String(merchandiseId),
        price: Math.round(merchandise.price),
        quantity: qty,
        name: merchandise.name,
      }],
      callbacks: {
        notification: `${process.env.BASE_URL}/payments/notification`,
      },
    };

    const snapToken = await snap.createTransaction(parameter);
    return { token: snapToken.token, orderId: code, code };
  } catch (error) {
    if (tx && !tx.finished) await tx.rollback();
    if (newTransaction) await newTransaction.destroy().catch(() => {});
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create transaction snap token: ${error.message}`,
    });
  }
};

module.exports = { createDonationSnapToken, createTransactionSnapToken };
