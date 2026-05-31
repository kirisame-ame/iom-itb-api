'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PengajuanBantuanStatuses', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      submissionId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        unique: true,
        references: {
          model: 'TallySubmissions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      currentStatus: {
        type: Sequelize.ENUM(
          'VERIFIKASI_BERKAS',
          'DIPANGGIL_WAWANCARA',
          'KEPUTUSAN_DITERIMA',
          'KEPUTUSAN_DITOLAK',
        ),
        allowNull: false,
        defaultValue: 'VERIFIKASI_BERKAS',
      },
      catatan: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      updatedBy: {
        type: Sequelize.STRING(128),
        allowNull: true,
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

    await queryInterface.addIndex('PengajuanBantuanStatuses', ['currentStatus'], {
      name: 'idx_pengajuan_bantuan_statuses_current_status',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('PengajuanBantuanStatuses');
  },
};
