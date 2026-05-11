const { Donations } = require('../../models');
const { Op } = require('sequelize');

// Utility function to hide words with asterisks
const hideNamePattern = (name) => {
  return name?.split(' ')?.map(word => word ? word[0] + '*'.repeat(word.length - 1) : '')?.join(' ');
};

const toPublicDonation = (donation, no) => {
  const plainDonation = donation.toJSON();
  const donationOptions = plainDonation.options || {};
  const isHidden = donationOptions.nameIsHidden;
  const isHambaAllah = donationOptions.isHambaAllah;
  const publicName = isHidden || isHambaAllah
    ? hideNamePattern(isHambaAllah ? 'Hamba Allah' : plainDonation.name)
    : plainDonation.name;

  return {
    no,
    name: !isHidden && isHambaAllah ? 'Hamba Allah' : publicName,
    amount: plainDonation.amount,
    date: plainDonation.date,
  };
};

// Add an id parameter for specific donation retrieval
const GetDonations = async ({ id = null, query = {}, search = '', isAdmin = false }) => {
  if (id) {
    try {
      const donation = await Donations.findByPk(id);
      if (!donation) {
        throw new Error(`Donation with id ${id} not found`);
      }

      if (donation.options?.nameIsHidden && !isAdmin) {
        donation.name = hideNamePattern(donation.name);
      }

      return donation;
    } catch (error) {
      throw new Error(`Failed to retrieve donation data: ${error.message}`);
    }
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  let orderBy = [['createdAt', 'DESC']];
  
  if (!isAdmin) {
    orderBy = [['date', 'DESC']];
  } else if (query.orderBy) {
    const allowedFields = ['createdAt', 'amount', 'name', 'date'];
    const orderDirection = query.sort ?? 'DESC';
    
    if (allowedFields.includes(query.orderBy)) {
      orderBy = [[query.orderBy, orderDirection]];
    }
  }

  const options = {
    where: {},
    limit,
    offset,
    order: orderBy,
  };

  if (!isAdmin) {
    options.attributes = ['name', 'amount', 'date', 'options'];
  }

  if (search) {
    options.where.name = { [Op.like]: `%${search}%` };
  }

  // Retry logic for database connection
  let retries = 3;
  let lastError;
  
  while (retries > 0) {
    try {
      const { rows, count } = await Donations.findAndCountAll(options);
      const processedRows = isAdmin
        ? rows
        : rows.map((donation, index) => toPublicDonation(donation, offset + index + 1));

      return {
        data: processedRows,
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      };
    } catch (error) {
      lastError = error;
      retries--;
      
      if (retries > 0) {
        console.log(`Database connection failed, retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        continue;
      }
      
      console.error('Database error in getDonations after retries:', error);
      
      // Check if it's a connection timeout error
      if (error.message.includes('ETIMEDOUT') || error.message.includes('connect')) {
        // Return empty data instead of throwing error for better UX
        return {
          data: [],
          total: 0,
          currentPage: page,
          totalPages: 0,
        };
      }
      
      throw new Error(`Failed to retrieve donation data: ${error.message}`);
    }
  }
};

module.exports = GetDonations;
