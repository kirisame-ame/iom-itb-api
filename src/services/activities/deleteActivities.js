const { Activities, ActivityMedia, sequelize } = require('../../models');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');

const DeleteActivities = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    const activity = await Activities.findByPk(id, { transaction });

    if (!activity) {
      throw {
        status: StatusCodes.NOT_FOUND,
        message: 'Activity not found',
      };
    }

    // Ambil media dulu sebelum dihapus
    const mediaList = await ActivityMedia.findAll({
      where: { activity_id: id },
      transaction
    });

    // Hapus file fisik dari server
    for (const media of mediaList) {
      if (media.type === 'image') {
        const filename = path.basename(media.value);
        const filePath = path.join(__dirname, '../../uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Hapus activity (ActivityMedia ikut terhapus via CASCADE)
    await activity.destroy({ transaction });

    await transaction.commit();

    return {
      status: StatusCodes.OK,
      message: 'Activity deleted successfully',
    };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Failed to delete activity: ${error.message || error}`);
  }
};

module.exports = DeleteActivities;