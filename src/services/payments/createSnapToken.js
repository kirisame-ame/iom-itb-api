const { StatusCodes } = require('http-status-codes');
const { Donations, Transactions, Merchandises, Faculties, sequelize } = require('../../models');
const BaseError = require('../../schemas/responses/BaseError');
const { snap } = require('../../config/midtrans');

const DONATION_TYPES = [
  'iuran_sukarela',
  'kontribusi_anggota',
  'kontribusi_donatur',
  'pembelian_merchandise',
  'kontribusi_sukarela',
];

const makeOrderId = (prefix, id) => `${prefix}-${id}-${Date.now()}`;

const buildFinishUrl = () => {
  const base = process.env.MIDTRANS_FINISH_REDIRECT_URL || process.env.WEB_APP_URL;
  return base ? `${base.replace(/\/$/, '')}/transaksi` : undefined;
};

const createDonationDraft = async (payload) => {
  const {
    name, email, noWhatsapp, notification,
    donationType, facultyId, options = {},
  } = payload;

  if (!name || !email || !noWhatsapp || !notification) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'name, email, noWhatsapp, notification are required',
    });
  }
  if (!DONATION_TYPES.includes(donationType)) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'Invalid donationType',
    });
  }
  const amount = Number(payload.amount);
  if (!amount || amount <= 0) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'amount must be > 0',
    });
  }

  let faculty = null;
  if (facultyId) {
    faculty = await Faculties.findByPk(facultyId);
    if (!faculty) {
      throw new BaseError({ status: StatusCodes.NOT_FOUND, message: 'Faculty not found' });
    }
  }

  const t = await sequelize.transaction();
  try {
    const donation = await Donations.create({
      name, email, noWhatsapp, notification,
      amount,
      grossAmount: amount,
      donationType,
      facultyId: faculty ? faculty.id : null,
      kodeUnik: faculty ? faculty.kodeUnik : null,
      paymentMethod: 'midtrans',
      paymentStatus: 'pending',
      options,
      date: new Date(),
    }, { transaction: t });

    donation.midtransOrderId = makeOrderId('DON', donation.id);
    await donation.save({ transaction: t });

    await t.commit();
    return { donation, faculty };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const createTransactionDraft = async (payload) => {
  const { merchandiseId, username, email, noTelp, address, qty } = payload;

  if (!merchandiseId || !username || !email || !noTelp || !address || !qty) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'merchandiseId, username, email, noTelp, address, qty are required',
    });
  }

  const merchandise = await Merchandises.findByPk(merchandiseId);
  if (!merchandise) {
    throw new BaseError({ status: StatusCodes.NOT_FOUND, message: 'Merchandise not found' });
  }
  if (merchandise.stock < qty) {
    throw new BaseError({ status: StatusCodes.BAD_REQUEST, message: 'Not enough stock available' });
  }

  const grossAmount = Number(merchandise.price) * Number(qty);

  const t = await sequelize.transaction();
  try {
    const trx = await Transactions.create({
      merchandiseId, username, email, noTelp, address, qty,
      status: 'waiting',
      payment: 'midtrans',
      paymentMethod: 'midtrans',
      paymentStatus: 'pending',
      grossAmount,
    }, { transaction: t });

    trx.code = `IOM-${Date.now()}-${trx.id}`;
    trx.midtransOrderId = makeOrderId('TRX', trx.id);
    await trx.save({ transaction: t });

    await t.commit();
    return { transaction: trx, merchandise };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const CreateSnapToken = async ({ type, payload }) => {
  if (type !== 'donation' && type !== 'transaction') {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'type must be "donation" or "transaction"',
    });
  }

  const finishUrl = buildFinishUrl();

  if (type === 'donation') {
    const { donation, faculty } = await createDonationDraft(payload);
    const itemName = `Donasi ${payload.donationType}${faculty ? ` (${faculty.name})` : ''}`;

    const snapResp = await snap.createTransaction({
      transaction_details: {
        order_id: donation.midtransOrderId,
        gross_amount: Number(donation.grossAmount),
      },
      item_details: [{
        id: `donation-${donation.id}`,
        name: itemName.slice(0, 50),
        quantity: 1,
        price: Number(donation.grossAmount),
      }],
      customer_details: {
        first_name: donation.name,
        email: donation.email,
        phone: donation.noWhatsapp,
      },
      callbacks: finishUrl ? { finish: finishUrl } : undefined,
    });

    return {
      token: snapResp.token,
      redirectUrl: snapResp.redirect_url,
      orderId: donation.midtransOrderId,
      recordId: donation.id,
    };
  }

  const { transaction: trx, merchandise } = await createTransactionDraft(payload);

  const snapResp = await snap.createTransaction({
    transaction_details: {
      order_id: trx.midtransOrderId,
      gross_amount: Number(trx.grossAmount),
    },
    item_details: [{
      id: `merch-${merchandise.id}`,
      name: merchandise.name.slice(0, 50),
      quantity: Number(trx.qty),
      price: Number(merchandise.price),
    }],
    customer_details: {
      first_name: trx.username,
      email: trx.email,
      phone: trx.noTelp,
      shipping_address: { address: trx.address },
    },
    callbacks: finishUrl ? { finish: finishUrl } : undefined,
  });

  return {
    token: snapResp.token,
    redirectUrl: snapResp.redirect_url,
    orderId: trx.midtransOrderId,
    code: trx.code,
    recordId: trx.id,
  };
};

module.exports = CreateSnapToken;
