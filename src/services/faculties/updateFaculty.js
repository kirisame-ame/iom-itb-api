const { StatusCodes } = require('http-status-codes');
const { Faculties } = require('../../models');
const BaseError = require('../../schemas/responses/BaseError');

const normalizeKode = (raw) => String(raw || '').trim().padStart(3, '0');

const UpdateFaculty = async (id, body) => {
  const faculty = await Faculties.findByPk(id);
  if (!faculty) {
    throw new BaseError({ status: StatusCodes.NOT_FOUND, message: 'Faculty not found' });
  }

  const patch = {};
  if (body.name !== undefined) patch.name = body.name;
  if (body.kodeUnik !== undefined) {
    const normalized = normalizeKode(body.kodeUnik);
    if (!/^\d{3}$/.test(normalized)) {
      throw new BaseError({
        status: StatusCodes.BAD_REQUEST,
        message: 'kodeUnik must be 3 digits',
      });
    }
    patch.kodeUnik = normalized;
  }
  if (body.isActive !== undefined) patch.isActive = !!body.isActive;

  await faculty.update(patch);
  return faculty;
};

module.exports = UpdateFaculty;
