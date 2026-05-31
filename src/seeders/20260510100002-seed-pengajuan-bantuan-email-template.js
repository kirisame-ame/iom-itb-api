'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('EmailTemplates', [
      {
        key: 'pengajuan_bantuan_status_update',
        title: 'Pengajuan Bantuan - Update Status',
        subject: 'Update Status Pengajuan Bantuan - {{status}} [IOM ITB]',
        body: `Halo {{name}},

Status pengajuan bantuan Anda telah diperbarui. Berikut detail terbaru:

ID Pengajuan: {{submission_id}}
Status: {{status}}
Catatan: {{catatan_line}}
Waktu Update: {{updated_at}}

Silakan hubungi kami atau login ke sistem untuk informasi lebih lanjut.

Terima kasih,
Tim Pengajuan Bantuan IOM ITB`,
        variables: JSON.stringify(['name', 'submission_id', 'status', 'catatan_line', 'updated_at']),
        channel: 'email',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('EmailTemplates', {
      key: ['pengajuan_bantuan_status_update'],
    });
  },
};
