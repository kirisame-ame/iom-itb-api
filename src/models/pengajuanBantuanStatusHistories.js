'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PengajuanBantuanStatusHistories extends Model {
    static associate(models) {
      PengajuanBantuanStatusHistories.belongsTo(models.TallySubmissions, {
        foreignKey: 'submissionId',
        as: 'submission',
      });
    }
  }

  PengajuanBantuanStatusHistories.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      submissionId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      oldStatus: {
        type: DataTypes.ENUM(
          'TIDAK_DIKETAHUI',
          'VERIFIKASI_BERKAS',
          'DIPANGGIL_WAWANCARA',
          'KEPUTUSAN_DITERIMA',
          'KEPUTUSAN_DITOLAK',
        ),
        allowNull: true,
      },
      newStatus: {
        type: DataTypes.ENUM(
          'TIDAK_DIKETAHUI',
          'VERIFIKASI_BERKAS',
          'DIPANGGIL_WAWANCARA',
          'KEPUTUSAN_DITERIMA',
          'KEPUTUSAN_DITOLAK',
        ),
        allowNull: false,
      },
      oldCatatan: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      newCatatan: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      changedBy: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      changedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'PengajuanBantuanStatusHistories',
      tableName: 'PengajuanBantuanStatusHistories',
    },
  );

  return PengajuanBantuanStatusHistories;
};
