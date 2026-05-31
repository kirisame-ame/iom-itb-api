const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');
const GetFaculties = require('../services/faculties/getFaculties');
const CreateFaculty = require('../services/faculties/createFaculty');
const UpdateFaculty = require('../services/faculties/updateFaculty');
const DeleteFaculty = require('../services/faculties/deleteFaculty');

const respond = (res, status, message, data) =>
  res.status(status).json(new BaseResponse({ status, message, data }));

const failure = (res, error, fallback) => {
  const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
  res.status(status).json(new BaseResponse({
    status,
    message: error.message || fallback,
  }));
};

const GetAllFaculties = async (req, res) => {
  try {
    const onlyActive = String(req.query.onlyActive).toLowerCase() === 'true';
    const data = await GetFaculties({ onlyActive });
    respond(res, StatusCodes.OK, 'Faculties fetched', data);
  } catch (error) {
    failure(res, error, 'Failed to fetch faculties');
  }
};

const GetFacultyById = async (req, res) => {
  try {
    const faculty = await GetFaculties({ id: req.params.id });
    if (!faculty) return respond(res, StatusCodes.NOT_FOUND, 'Faculty not found');
    respond(res, StatusCodes.OK, 'Faculty fetched', faculty);
  } catch (error) {
    failure(res, error, 'Failed to fetch faculty');
  }
};

const CreateNewFaculty = async (req, res) => {
  try {
    const faculty = await CreateFaculty(req.body);
    respond(res, StatusCodes.CREATED, 'Faculty created', faculty);
  } catch (error) {
    failure(res, error, 'Failed to create faculty');
  }
};

const UpdateFacultyById = async (req, res) => {
  try {
    const faculty = await UpdateFaculty(req.params.id, req.body);
    respond(res, StatusCodes.OK, 'Faculty updated', faculty);
  } catch (error) {
    failure(res, error, 'Failed to update faculty');
  }
};

const DeleteFacultyById = async (req, res) => {
  try {
    const result = await DeleteFaculty(req.params.id);
    respond(res, StatusCodes.OK, result.message);
  } catch (error) {
    failure(res, error, 'Failed to delete faculty');
  }
};

module.exports = {
  GetAllFaculties,
  GetFacultyById,
  CreateNewFaculty,
  UpdateFacultyById,
  DeleteFacultyById,
};
