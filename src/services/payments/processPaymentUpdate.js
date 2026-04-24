const { Donations, Transactions, Merchandises, sequelize } = require('../../models');
const { DonationDto, TransactionDto } = require('../../dtos/payments');
const sendEmail = require('../../utils/mailer');
const sendWhatsApp = require('../../utils/whatsapp');
const { restoreMerchandiseStock } = require('./stockHelper');
const {
  buildDonationPaymentEmail,
  buildTransactionPaymentEmail,
} = require('./templates/paymentConfirmation');

const assertAmountMatches = (orderId, expected, actual) => {
  if (expected == null) return;
  if (Number(actual) !== Number(expected)) {
    throw new Error(`Amount mismatch for ${orderId}: expected ${expected}, got ${actual}`);
  }
};

const sendNotificationEmail = async (to, email) => {
  if (!to || !email) return null;
  return sendEmail({
    to,
    subject: email.subject,
    html: email.html,
    attachments: email.attachments,
  });
};

/**
 * @param {DonationDto} donation
 * @param {string} transactionId
 */
const notifyDonationPaid = async (donation, transactionId) => {
  const channels = donation.getNotificationChannels();
  const tasks = [];
  const confirmationPayload = donation.toPaymentConfirmationPayload(transactionId);

  if (channels.whatsapp && donation.noWhatsapp) {
    const message = `Halo ${donation.name}!\n\nPembayaran donasi Anda sebesar Rp ${confirmationPayload.amount} telah berhasil dikonfirmasi.\n\nTerima kasih atas kontribusi Anda kepada IOM ITB!\n\nSalam,\nIOM ITB`;
    tasks.push(
      sendWhatsApp(
        donation.noWhatsapp,
        message,
        `donation-${donation.id}-paid`,
        `donation-${donation.id}`
      )
    );
  }

  if (donation.email) {
    tasks.push(
      sendNotificationEmail(
        donation.email,
        buildDonationPaymentEmail(confirmationPayload)
      )
    );
  }

  await Promise.allSettled(tasks);
};

/**
 * @param {TransactionDto} trx
 * @param {string} transactionId
 */
const notifyTransactionPaid = async (trx, transactionId) => {
  const tasks = [];
  const confirmationPayload = trx.toPaymentConfirmationPayload(transactionId);

  if (trx.noTelp) {
    const message = `Halo ${trx.username}!\n\nPembayaran pesanan Anda telah berhasil!\n\nKode Pesanan: ${confirmationPayload.code}\nProduk: ${confirmationPayload.merchandiseName} x ${trx.qty}\nTotal: Rp ${confirmationPayload.amount}\n\nPesanan Anda sedang diproses.\n\nSalam,\nIOM ITB`;
    tasks.push(
      sendWhatsApp(
        trx.noTelp,
        message,
        `transaction-${trx.id}-paid`,
        `transaction-${trx.id}`
      )
    );
  }

  if (trx.email) {
    tasks.push(
      sendNotificationEmail(
        trx.email,
        buildTransactionPaymentEmail(confirmationPayload)
      )
    );
  }

  await Promise.allSettled(tasks);
};

/**
 * @param {import('../../dtos/payments').PaymentNotificationDto} notification
 * @returns {Promise<{ message: string }>}
 */
const processDonationPayment = async (notification) => {
  let donationDto = null;
  let currentState = 'updated';

  await sequelize.transaction(async (transaction) => {
    const donation = await Donations.findOne({
      where: { midtransOrderId: notification.orderId },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!donation) {
      currentState = 'not_found';
      return;
    }

    if (donation.paymentStatus === 'settlement') {
      currentState = 'already_settled';
      return;
    }

    assertAmountMatches(notification.orderId, donation.grossAmount, notification.grossAmount);

    const updates = {
      paymentStatus: notification.paymentStatus,
      midtransTransactionId: notification.transactionId,
      paymentType: notification.paymentType || donation.paymentType,
      vaNumber: notification.vaNumber || donation.vaNumber,
      fraudStatus: notification.fraudStatus || donation.fraudStatus,
      rawNotification: notification.raw,
    };

    if (notification.isPaid) {
      updates.proof = `midtrans:${notification.transactionId}`;
      updates.date = notification.paidAt;
      updates.paidAt = notification.paidAt;
    }

    await donation.update(updates, { transaction });
    donationDto = DonationDto.fromModel(donation);
  });

  if (currentState === 'not_found') return { message: 'Donation not found' };
  if (currentState === 'already_settled') return { message: 'Payment already settled' };

  if (notification.isPaid && donationDto) {
    await notifyDonationPaid(donationDto, notification.transactionId);
    return { message: 'Payment processed' };
  }

  return { message: `Payment status: ${notification.paymentStatus}` };
};

/**
 * @param {import('../../dtos/payments').PaymentNotificationDto} notification
 * @returns {Promise<{ message: string }>}
 */
const processTransactionPayment = async (notification) => {
  let transactionDto = null;
  let currentState = 'updated';

  await sequelize.transaction(async (transaction) => {
    const trx = await Transactions.findOne({
      where: { midtransOrderId: notification.orderId },
      include: [{ model: Merchandises, as: 'merchandises' }],
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!trx) {
      currentState = 'not_found';
      return;
    }

    if (trx.paymentStatus === 'settlement') {
      currentState = 'already_settled';
      return;
    }

    assertAmountMatches(notification.orderId, trx.grossAmount, notification.grossAmount);

    const updates = {
      paymentStatus: notification.paymentStatus,
      midtransTransactionId: notification.transactionId,
      paymentType: notification.paymentType || trx.paymentType,
      vaNumber: notification.vaNumber || trx.vaNumber,
      fraudStatus: notification.fraudStatus || trx.fraudStatus,
      rawNotification: notification.raw,
    };

    if (notification.isPaid) {
      updates.status = 'on process';
      updates.payment = `midtrans:${notification.transactionId}`;
      updates.paidAt = notification.paidAt;
    } else if (notification.isFailed) {
      updates.status = 'canceled';
      if (trx.stockDeducted) {
        await restoreMerchandiseStock(
          { merchandiseId: trx.merchandiseId, qty: trx.qty },
          transaction
        );
        updates.stockDeducted = false;
      }
    }

    await trx.update(updates, { transaction });
    transactionDto = TransactionDto.fromModel(trx);
  });

  if (currentState === 'not_found') return { message: 'Transaction not found' };
  if (currentState === 'already_settled') return { message: 'Payment already settled' };

  if (notification.isPaid && transactionDto) {
    await notifyTransactionPaid(transactionDto, notification.transactionId);
    return { message: 'Payment processed' };
  }

  return { message: `Payment status: ${notification.paymentStatus}` };
};

/**
 * @param {import('../../dtos/payments').PaymentNotificationDto} notification
 * @returns {Promise<{ message: string }>}
 */
const processPaymentUpdate = async (notification) => {
  if (notification.scope === 'donation') {
    return processDonationPayment(notification);
  }

  if (notification.scope === 'transaction') {
    return processTransactionPayment(notification);
  }

  return { message: 'Unknown order type' };
};

module.exports = processPaymentUpdate;
