const { Donations, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const { getDonationAmountBreakdown } = require('./donationAmount');

const UpdateDonations = async (id, body) => {
  const transaction = await sequelize.transaction();

  try {
    // Fetch the existing donation record
    const donation = await Donations.findByPk(id, { transaction });

    if (!donation) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Donation not found',
      });
    }

    const { name, email, noWhatsapp, notification, proof, amount, date, bank, donationType, facultyId } = body;
    const nameIsHidden = body.nameIsHidden;
    const isHambaAllah = body.isHambaAllah;
    const hasAmountUpdate = amount !== undefined && amount !== null && amount !== '';
    const hasFacultyUpdate = facultyId !== undefined;
    const nextFacultyId = hasFacultyUpdate ? facultyId : donation.facultyId;
    let amountBreakdown = null;

    if (!name && !email && !noWhatsapp && !notification && !proof && nameIsHidden === undefined && !hasAmountUpdate && !date && !bank && isHambaAllah === undefined && donationType === undefined && facultyId === undefined) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'At least one field (name, email, noWhatsapp, notification, amount, proof, or nameIsHidden) must be provided for update',
      });
    }

    if (hasAmountUpdate || hasFacultyUpdate) {
      amountBreakdown = await getDonationAmountBreakdown({
        amount: hasAmountUpdate ? amount : donation.amount,
        facultyId: nextFacultyId,
      });
    }

    // Update the donation with new data
    const updatedDonation = await Donations.update(
      {
        name: name || donation.name,
        email: email || donation.email,
        noWhatsapp: noWhatsapp || donation.noWhatsapp,
        notification: notification || donation.notification,
        proof: proof || donation.proof,
        amount: amountBreakdown ? amountBreakdown.baseAmount : donation.amount,
        grossAmount: amountBreakdown ? amountBreakdown.grossAmount : donation.grossAmount,
        donationType: donationType !== undefined ? donationType : donation.donationType,
        facultyId: amountBreakdown ? amountBreakdown.facultyId : donation.facultyId,
        kodeUnik: amountBreakdown ? amountBreakdown.uniqueCode : donation.kodeUnik,
        options: {
          nameIsHidden: nameIsHidden !== undefined ? nameIsHidden : donation.options?.nameIsHidden,
          isHambaAllah: isHambaAllah !== undefined ? isHambaAllah : donation.options?.isHambaAllah,
          donationType: donationType !== undefined ? donationType : donation.options?.donationType,
          facultyId: amountBreakdown ? amountBreakdown.facultyId : (hasFacultyUpdate ? nextFacultyId : donation.options?.facultyId),
        },
        date: date || donation.date,
        bank: bank || donation.bank,
      },
      {
        where: { id },
        transaction,
      }
    );

    await transaction.commit();

    return updatedDonation;
  } catch (error) {
    await transaction.rollback();

    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to update donation: ${error.message || error}`,
    });
  }
};

module.exports = UpdateDonations;
