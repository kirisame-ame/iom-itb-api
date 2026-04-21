const { StatusCodes } = require('http-status-codes');
const { Faculties } = require('../../models');
const BaseError = require('../../schemas/responses/BaseError');

const DeleteFaculty = async (id) => {
  const faculty = await Faculties.findByPk(id);
  if (!faculty) {
    throw new BaseError({ status: StatusCodes.NOT_FOUND, message: 'Faculty not found' });
  }

  await faculty.destroy();
  return { message: 'Faculty deleted' };
};

module.exports = DeleteFaculty;
