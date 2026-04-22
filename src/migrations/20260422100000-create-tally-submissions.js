'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TallySubmissions', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      tallySubmissionId: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      respondentId: {
        type: Sequelize.STRING(128),
        allowNull: true,
      },
      formId: {
        type: Sequelize.STRING(128),
        allowNull: true,
      },
      formSlug: {
        type: Sequelize.ENUM('pendaftaran_anggota', 'pengajuan_bantuan', 'orang_tua_asuh'),
        allowNull: false,
      },
      submittedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      payload: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      extractedWhatsapp: {
        type: Sequelize.STRING(64),
        allowNull: true,
      },
      sourceType: {
        type: Sequelize.ENUM('webhook', 'csv_seed'),
        allowNull: false,
        defaultValue: 'webhook',
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

    await queryInterface.addIndex('TallySubmissions', ['formSlug', 'submittedAt'], {
      name: 'idx_tally_submissions_form_slug_submitted_at',
    });

    await queryInterface.addIndex('TallySubmissions', ['formSlug', 'tallySubmissionId'], {
      name: 'uq_tally_submissions_form_slug_submission_id',
      unique: true,
    });

    await queryInterface.addIndex('TallySubmissions', ['formId'], {
      name: 'idx_tally_submissions_form_id',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('TallySubmissions');
  },
};
