const { Donations, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const CreateDonations = async (body) => {
  const transaction = await sequelize.transaction();

  try {
    // Validate required fields
    const { name, email, noWhatsapp, notification, proof, nameIsHidden, amount, date, bank, isHambaAllah, donationType, facultyId} = body;

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

    // Create the donation record within a transaction
    const newDonation = await Donations.create(
      {
        name,
        email,
        noWhatsapp,
        proof,
        notification,
        amount,
        grossAmount: amount,
        donationType,
        facultyId,
        paymentMethod: 'manual',
        paymentStatus: 'pending',
        options: {
          nameIsHidden: nameIsHidden,
          isHambaAllah:  isHambaAllah
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
