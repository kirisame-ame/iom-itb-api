const { Donations, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const { getDonationAmountBreakdown } = require('./donationAmount');

const CreateDonations = async (body) => {
  const transaction = await sequelize.transaction();

  try {
    // Validate required fields
    const { name, email, noWhatsapp, notification, proof, amount, date, bank, donationType, facultyId } = body;
    const nameIsHidden = body.nameIsHidden ?? body.options?.nameIsHidden ?? false;
    const isHambaAllah = body.isHambaAllah ?? body.options?.isHambaAllah ?? false;

    if(!email && !noWhatsapp){
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Email or No Whatsapp type are required fields',
      });
    }

    if (!name || !notification) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Name and notification type are required fields',
      });
    }

    const amountBreakdown = await getDonationAmountBreakdown({ amount, facultyId });

    // Create the donation record within a transaction
    const newDonation = await Donations.create(
      {
        name,
        email,
        noWhatsapp,
        proof,
        notification,
        amount: amountBreakdown.baseAmount,
        grossAmount: amountBreakdown.grossAmount,
        donationType,
        facultyId: amountBreakdown.facultyId,
        kodeUnik: amountBreakdown.uniqueCode,
        paymentMethod: 'manual',
        paymentStatus: 'pending',
        options: {
          donationType,
          facultyId: amountBreakdown.facultyId,
          nameIsHidden,
          isHambaAllah,
        },
        date,
        bank
      },
      { transaction }
    );

    // Commit the transaction
    await transaction.commit();

    return newDonation;
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    // Re-throw the error for handling
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create donation: ${error.message || error}`,
    });
  }
};

module.exports = CreateDonations;
