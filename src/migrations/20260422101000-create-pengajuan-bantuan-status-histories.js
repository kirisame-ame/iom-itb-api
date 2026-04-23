'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PengajuanBantuanStatusHistories', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      submissionId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'TallySubmissions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      oldStatus: {
        type: Sequelize.ENUM(
          'VERIFIKASI_BERKAS',
          'DIPANGGIL_WAWANCARA',
          'KEPUTUSAN_DITERIMA',
          'KEPUTUSAN_DITOLAK',
        ),
        allowNull: true,
      },
      newStatus: {
        type: Sequelize.ENUM(
          'VERIFIKASI_BERKAS',
          'DIPANGGIL_WAWANCARA',
          'KEPUTUSAN_DITERIMA',
          'KEPUTUSAN_DITOLAK',
        ),
        allowNull: false,
      },
      oldCatatan: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      newCatatan: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      changedBy: {
        type: Sequelize.STRING(128),
        allowNull: true,
      },
      changedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('PengajuanBantuanStatusHistories', ['submissionId', 'changedAt'], {
      name: 'idx_pengajuan_bantuan_status_histories_submission_changed_at',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('PengajuanBantuanStatusHistories');
  },
};
