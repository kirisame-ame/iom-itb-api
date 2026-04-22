'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PengajuanBantuanStatuses extends Model {
    static associate(models) {
      PengajuanBantuanStatuses.belongsTo(models.TallySubmissions, {
        foreignKey: 'submissionId',
        as: 'submission',
      });
    }
  }

  PengajuanBantuanStatuses.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      submissionId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        unique: true,
      },
      currentStatus: {
        type: DataTypes.ENUM(
          'VERIFIKASI_BERKAS',
          'DIPANGGIL_WAWANCARA',
          'KEPUTUSAN_DITERIMA',
          'KEPUTUSAN_DITOLAK',
        ),
        allowNull: false,
        defaultValue: 'VERIFIKASI_BERKAS',
      },
      catatan: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      updatedBy: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'PengajuanBantuanStatuses',
      tableName: 'PengajuanBantuanStatuses',
    },
  );

  return PengajuanBantuanStatuses;
};
