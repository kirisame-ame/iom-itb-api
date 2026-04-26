const { Transactions, Merchandises } = require('../../models');
const { Op } = require('sequelize');

// Add an id parameter for specific transaction checks
const GetTransactions = async (key, query = {}, search = '') => {
  // If id is provided, return the transaction by id
  if (key?.id) {
    try {
      const transaction = await Transactions.findByPk(key.id, {
        include: {
          model: Merchandises,
          as: 'merchandises',
          // Remove the attributes option to include all fields
        },
      });

      if (!transaction) {
        throw new Error(`Transaction with id ${key.id} not found`);
      }
      return { data: transaction }; // Return transaction details
    } catch (error) {
      throw new Error(`Failed to retrieve transaction data: ${error.message}`);
    }
  }

  // If transaction code is provided, search by transaction code
  if (key?.code) {
    try {
      const transaction = await Transactions.findOne({
        where: { code: key.code },
        include: {
          model: Merchandises,
          as: 'merchandises',
          // Remove the attributes option to include all fields
        },
      });
      if (!transaction) {
        throw new Error(`Transaction with code ${key.code} not found`);
      }
      
      return { data: transaction };  // Return transaction details
    } catch (error) {
      throw new Error(`Failed to retrieve transaction data: ${error.message}`);
    }
  }

  // Logic for retrieving all transactions
  const page = parseInt(query.page, 10) || 1;  // Get page value from query params (default 1)
  const limit = parseInt(query.limit, 10) || 10;  // Get limit value from query params (default 10)
  const offset = (page - 1) * limit;  // Calculate offset based on page and limit

  const options = {
    where: {},
    limit,
    offset,
    order: [['createdAt', 'DESC']],  // Order by creation date descending
    include: {
      model: Merchandises,
      as: 'merchandises',
      // Remove the attributes option to include all fields
    },
  };

  if (query.status) {
    options.where.status = query.status;
  }

  if (query.paymentMethod) {
    options.where.paymentMethod = query.paymentMethod;
  }

  if (query.paymentStatus) {
    options.where.paymentStatus = query.paymentStatus;
  }

  const searchKeyword = search || query.search;

  if (searchKeyword) {
    options.where[Op.or] = [
      { code: { [Op.like]: `%${searchKeyword}%` } },
      { username: { [Op.like]: `%${searchKeyword}%` } },
      { email: { [Op.like]: `%${searchKeyword}%` } },
      { noTelp: { [Op.like]: `%${searchKeyword}%` } },
      { '$merchandises.name$': { [Op.like]: `%${searchKeyword}%` } },
    ];
  }

  try {
    const { rows, count } = await Transactions.findAndCountAll(options);

    return {
      data: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    throw new Error(`Failed to retrieve transaction data: ${error.message}`);
  }
};

module.exports = GetTransactions;
