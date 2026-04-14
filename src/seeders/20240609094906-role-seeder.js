"use strict";

const ROLE = require("../schemas/enums/role");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.removeColumn('Roles', 'id');

    // await queryInterface.addColumn('Roles', 'id', {
    //   type: Sequelize.DataTypes.UUID,
    //   defaultValue: Sequelize.literal('UUID()'),
    //   allowNull: false,
    //   primaryKey: true,
    // });

    const now = new Date();
    const roles = [
      { id: uuidv4(), name: ROLE.Siswa, createdAt: now, updatedAt: now },
      { id: uuidv4(), name: ROLE.Mahasiswa, createdAt: now, updatedAt: now },
      { id: uuidv4(), name: ROLE.EO, createdAt: now, updatedAt: now },
      { id: uuidv4(), name: ROLE.Sponsor, createdAt: now, updatedAt: now },
      { id: uuidv4(), name: ROLE.Perusahaan, createdAt: now, updatedAt: now },
      { id: uuidv4(), name: ROLE.Umum, createdAt: now, updatedAt: now },
      { id: uuidv4(), name: ROLE.Juri, createdAt: now, updatedAt: now },
      { id: uuidv4(), name: ROLE.Admin, createdAt: now, updatedAt: now },
    ];

    return queryInterface.bulkInsert("Roles", roles, {
      ignoreDuplicates: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.removeConstraint('Users', 'FK_Users_Roles');
    // await queryInterface.removeColumn('Roles', 'id');

    // await queryInterface.addColumn('Roles', 'id', {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    //   primaryKey: true,
    // });

    return queryInterface.bulkDelete("Roles", null, {});
  },
};
