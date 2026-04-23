'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TallyWebhookEvents', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      eventKey: {
        type: Sequelize.STRING(191),
        allowNull: false,
        unique: true,
      },
      formSlug: {
        type: Sequelize.ENUM('pendaftaran_anggota', 'pengajuan_bantuan', 'orang_tua_asuh'),
        allowNull: false,
      },
      signatureHeader: {
        type: Sequelize.STRING(512),
        allowNull: true,
      },
      headersJson: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      payloadJson: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      processStatus: {
        type: Sequelize.ENUM('RECEIVED', 'PROCESSED', 'FAILED', 'IGNORED_DUPLICATE'),
        allowNull: false,
        defaultValue: 'RECEIVED',
      },
      errorMessage: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      receivedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      processedAt: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex('TallyWebhookEvents', ['formSlug', 'processStatus'], {
      name: 'idx_tally_webhook_events_form_slug_process_status',
    });

    await queryInterface.addIndex('TallyWebhookEvents', ['receivedAt'], {
      name: 'idx_tally_webhook_events_received_at',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('TallyWebhookEvents');
  },
};
