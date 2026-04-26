const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');
const DataTable = require('../schemas/responses/DataTable');
const CreateActivity = require('../services/activities/createActivities');
const GetActivities = require('../services/activities/getActivities');
const UpdateActivity = require('../services/activities/updateActivities');
const DeleteActivity = require('../services/activities/deleteActivities');

const GetActivityBySlug = async (req, res) => {
  try {
    const { slug } = req.params; // Mendapatkan id dari parameter URL
    const activity = await GetActivities({ slug }); // Mengambil detail activity berdasarkan ID

    // Jika activity tidak ditemukan, kembalikan respon 404
    if (!activity || activity.message) {
      return res.status(StatusCodes.NOT_FOUND).json(new BaseResponse({
        status: StatusCodes.NOT_FOUND,
        message: 'Activity tidak ditemukan',
      }));
    }

    // Kembalikan data activity jika ditemukan
    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Activity ditemukan',
      data: activity,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Terjadi kesalahan saat mengambil activity',
    }));
  }
};

// Get all activities
const GetAllActivities = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const pageNumber = parseInt(page);
    const pageLimit = parseInt(limit);
    const activities = await GetActivities({
      search,
      page: pageNumber,
      limit: pageLimit,
      status,
    });

    const totalEntries = activities.total;
    const totalPages = Math.ceil(totalEntries / pageLimit);

    const start = (pageNumber - 1) * pageLimit + 1;
    const end = Math.min(pageNumber * pageLimit, totalEntries);

    res.status(StatusCodes.OK).json({
      data: new DataTable(activities.data)?.data,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        start,
        end,
        totalEntries,
      }
    });
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message,
    }));
  }
};

// Create new activity
const CreateNewActivity = async (req, res) => {
  try {
    const { body } = req; // Data yang dikirim dari client (request body)
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const newActivity = await CreateActivity(body, baseUrl);

    res.status(StatusCodes.CREATED).json(new BaseResponse({
      status: StatusCodes.CREATED,
      message: 'Activity created successfully',
      data: newActivity,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message || 'Failed to create activity',
    }));
  }
};

// Update activity by ID
const UpdateActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const updatedActivity = await UpdateActivity(id, body);

    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Activity berhasil diperbarui',
      data: updatedActivity,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message,
    }));
  }
};

// Delete activity by ID
const DeleteActivityById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await DeleteActivity(id);
    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: result.message,
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status,
      message: error.message,
    }));
  }
};

module.exports = {
  GetActivityBySlug,
  GetAllActivities,
  CreateNewActivity,
  UpdateActivityById,
  DeleteActivityById,
};
