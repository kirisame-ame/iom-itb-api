const { StatusCodes } = require('http-status-codes');
const { Faculties } = require('../../models');
const BaseError = require('../../schemas/responses/BaseError');

const normalizeKode = (raw) => String(raw || '').trim().padStart(3, '0');

const CreateFaculty = async (body) => {
  const { name, kodeUnik, isActive } = body;

  if (!name || !kodeUnik) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'name and kodeUnik are required',
    });
  }

  const normalized = normalizeKode(kodeUnik);
  if (!/^\d{3}$/.test(normalized)) {
    throw new BaseError({
      status: StatusCodes.BAD_REQUEST,
      message: 'kodeUnik must be 3 digits',
    });
  }

  return Faculties.create({
    name,
    kodeUnik: normalized,
    isActive: isActive !== undefined ? !!isActive : true,
  });
};

module.exports = CreateFaculty;
