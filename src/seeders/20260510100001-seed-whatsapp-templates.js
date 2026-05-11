'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('EmailTemplates', [
      {
        key: 'pendaftaran_anggota_form_whatsapp',
        title: 'Pendaftaran Anggota - Konfirmasi Penerimaan Form',
        subject: null,
        body: "Halo {{name}}, terima kasih. Form pendaftaran anggota Anda sudah kami terima. Ref: {{submission_id}}.",
        variables: JSON.stringify(['name', 'submission_id']),
        channel: 'whatsapp',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        key: 'pengajuan_bantuan_form_whatsapp',
        title: 'Pengajuan Bantuan - Konfirmasi Penerimaan Form',
        subject: null,
        body: "Halo {{name}}, pengajuan bantuan Anda sudah kami terima dan akan segera diproses. Ref: {{submission_id}}.",
        variables: JSON.stringify(['name', 'submission_id']),
        channel: 'whatsapp',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        key: 'orang_tua_asuh_form_whatsapp',
        title: 'Orang Tua Asuh - Konfirmasi Penerimaan Form',
        subject: null,
        body: "Halo {{name}}, terima kasih. Form Orang Tua Asuh Anda sudah kami terima. Ref: {{submission_id}}.",
        variables: JSON.stringify(['name', 'submission_id']),
        channel: 'whatsapp',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('EmailTemplates', {
      key: [
        'pendaftaran_anggota_form_whatsapp',
        'pengajuan_bantuan_form_whatsapp',
        'orang_tua_asuh_form_whatsapp',
      ],
    });
  },
};
