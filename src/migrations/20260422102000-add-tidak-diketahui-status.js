'use strict';

const ENUM_VALUES = "'TIDAK_DIKETAHUI','VERIFIKASI_BERKAS','DIPANGGIL_WAWANCARA','KEPUTUSAN_DITERIMA','KEPUTUSAN_DITOLAK'";

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(
      `ALTER TABLE PengajuanBantuanStatuses MODIFY COLUMN currentStatus ENUM(${ENUM_VALUES}) NOT NULL DEFAULT 'VERIFIKASI_BERKAS'`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE PengajuanBantuanStatusHistories MODIFY COLUMN oldStatus ENUM(${ENUM_VALUES}) NULL`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE PengajuanBantuanStatusHistories MODIFY COLUMN newStatus ENUM(${ENUM_VALUES}) NOT NULL`,
    );
  },

  down: async (queryInterface) => {
    const OLD_ENUM = "'VERIFIKASI_BERKAS','DIPANGGIL_WAWANCARA','KEPUTUSAN_DITERIMA','KEPUTUSAN_DITOLAK'";
    await queryInterface.sequelize.query(
      `ALTER TABLE PengajuanBantuanStatuses MODIFY COLUMN currentStatus ENUM(${OLD_ENUM}) NOT NULL DEFAULT 'VERIFIKASI_BERKAS'`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE PengajuanBantuanStatusHistories MODIFY COLUMN oldStatus ENUM(${OLD_ENUM}) NULL`,
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE PengajuanBantuanStatusHistories MODIFY COLUMN newStatus ENUM(${OLD_ENUM}) NOT NULL`,
    );
  },
};
