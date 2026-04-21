const { Transactions, Merchandises, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');
const fs = require('fs');
const path = require('path'); // Ensure path is imported

const CreateTransaction = async (body, files, uploadPath) => {
  // Start transaction
  const transaction = await sequelize.transaction();
  const imageFile = files && files['payment'] ? files['payment'][0] : null;
  try {
    // Validate required fields
    const { merchandiseId, username, email, noTelp, address, qty } = body;

    if (!merchandiseId || !username || !email || !noTelp || !address || qty == null) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'Merchandise ID, username, email, noTelp, address, and qty are required fields',
      });
    }

    // Validate if merchandise exists
    const merchandise = await Merchandises.findByPk(merchandiseId);
    if (!merchandise) {
      throw new BaseError({
        status: StatusCodes.NOT_FOUND,
        message: 'Merchandise not found',
      });
    }

    // Handle image file for payment
    const imageFileName = imageFile ? `${uploadPath}/public/images/transactions/${imageFile.filename}` : null;

    const grossAmount = Number(merchandise.price) * Number(qty);

    // Create the transaction record within a transaction
    const newTransaction = await Transactions.create(
      {
        username,
        email,
        noTelp,
        address,
        merchandiseId,
        qty,
        payment: imageFileName, // Store the payment image path
        status: 'waiting', // Default status
        paymentMethod: 'manual',
        paymentStatus: 'pending',
        grossAmount,
      },
      { transaction }
    );

    // Generate a transaction code after the transaction record is created
    newTransaction.code = `IOM-${Date.now()}-${newTransaction.id}`; // Use the ID of the newly created transaction

    // Save the updated transaction with the generated code
    await newTransaction.save({ transaction });

    // Commit the transaction
    await transaction.commit();

    // Return the transaction code and other relevant information if needed
    return {
      code: newTransaction.code,
      message: 'Transaction created successfully',
      transactionId: newTransaction.id // Optional: return transaction ID if needed
    };
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    // Clean up uploaded files if any errors occur
    if (files && imageFile) {
      const imageFilePath = path.join(__dirname, '../../public/images/transactions', imageFile.filename);
      if (fs.existsSync(imageFilePath)) {
        fs.unlinkSync(imageFilePath);
      }
    }

    // Re-throw the error for handling
    throw new BaseError({
      status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Failed to create transaction: ${error.message || error}`,
    });
  }
};

module.exports = CreateTransaction;
