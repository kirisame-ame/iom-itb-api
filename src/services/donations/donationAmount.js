const { Faculties } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const BaseError = require('../../schemas/responses/BaseError');

const parseDonationAmount = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? Math.trunc(value) : NaN;
  }

  const raw = String(value || '').trim();
  if (!raw) return NaN;

  const digitsOnly = raw.replace(/[^\d]/g, '');
  return digitsOnly ? Number.parseInt(digitsOnly, 10) : NaN;
};

const normalizeFacultyUniqueCode = (kodeUnik) => {
  const digits = String(kodeUnik || '').replace(/\D/g, '');
  if (!digits) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'Fakultas belum memiliki kode unik 3 digit.',
    });
  }

  const normalized = digits.slice(-3).padStart(3, '0');
  if (!/^\d{3}$/.test(normalized)) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'Kode unik fakultas harus terdiri dari 3 digit.',
    });
  }

  return normalized;
};

const validateBaseDonationAmount = (amount) => {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'Nominal donasi harus berupa angka bulat positif.',
    });
  }

  if (amount % 1000 !== 0) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'Nominal donasi harus berakhir dengan 000 atau kelipatan Rp1.000.',
    });
  }

  return amount;
};

const getDonationAmountBreakdown = async ({ amount, facultyId }) => {
  if (!facultyId) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'facultyId is required',
    });
  }

  const faculty = await Faculties.findByPk(facultyId, {
    attributes: ['id', 'name', 'kodeUnik'],
  });

  if (!faculty) {
    throw new BaseError({
      status: StatusCodes.NOT_FOUND,
      message: 'Faculty not found',
    });
  }

  const baseAmount = validateBaseDonationAmount(parseDonationAmount(amount));
  const uniqueCode = normalizeFacultyUniqueCode(faculty.kodeUnik);
  const uniqueCodeAmount = Number.parseInt(uniqueCode, 10);

  return {
    faculty,
    facultyId: faculty.id,
    facultyName: faculty.name,
    uniqueCode,
    uniqueCodeAmount,
    baseAmount,
    grossAmount: baseAmount + uniqueCodeAmount,
  };
};

module.exports = {
  parseDonationAmount,
  normalizeFacultyUniqueCode,
  validateBaseDonationAmount,
  getDonationAmountBreakdown,
};
