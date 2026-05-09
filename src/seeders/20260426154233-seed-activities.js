"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Insert Activities
    await queryInterface.bulkInsert("Activities", [
      {
        id: 1,
        title: "Seminar Nasional Kemanusiaan 2024",
        date: new Date("2024-03-15"),
        description: "<p>Seminar nasional yang membahas isu-isu kemanusiaan terkini di Indonesia. Dihadiri oleh lebih dari 200 peserta dari berbagai universitas.</p><p>Kegiatan ini mencakup sesi diskusi panel, workshop, dan presentasi penelitian.</p>",
        url: "seminar-nasional-kemanusiaan-2024",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
        status: "published",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        title: "Workshop Migrasi dan Pengungsi",
        date: new Date("2024-05-20"),
        description: "<p>Workshop interaktif mengenai isu migrasi dan pengungsi di Asia Tenggara.</p><blockquote>Membangun kesadaran kolektif untuk masa depan yang lebih inklusif.</blockquote><p>Peserta akan mendapatkan pemahaman mendalam tentang regulasi dan kondisi lapangan.</p>",
        url: "workshop-migrasi-dan-pengungsi",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
        status: "published",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        title: "Kampanye Awareness Stateless Persons",
        date: new Date("2024-07-10"),
        description: "<p>Kampanye untuk meningkatkan kesadaran masyarakat tentang isu orang tanpa kewarganegaraan.</p><p>Draft ini masih dalam tahap persiapan konten dan koordinasi dengan mitra.</p>",
        url: "kampanye-awareness-stateless-persons",
        image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800",
        status: "draft",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        title: "Pelatihan Fasilitator Komunitas",
        date: new Date("2024-09-05"),
        description: "<h2>Tentang Pelatihan</h2><p>Pelatihan intensif selama 3 hari untuk mempersiapkan fasilitator komunitas.</p><ul><li>Teknik fasilitasi dasar</li><li>Manajemen konflik</li><li>Komunikasi lintas budaya</li></ul>",
        url: "pelatihan-fasilitator-komunitas",
        image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
        status: "draft",
        createdAt: now,
        updatedAt: now,
      },
    ], { ignoreDuplicates: true });

    // Insert ActivityMedia
    await queryInterface.bulkInsert("ActivityMedia", [
      // Activity 1 — image + youtube
      {
        activity_id: 1,
        type: "image",
        value: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
        order: 0,
        caption: "Pembukaan seminar oleh keynote speaker",
        createdAt: now,
        updatedAt: now,
      },
      {
        activity_id: 1,
        type: "image",
        value: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",
        order: 1,
        caption: "Sesi diskusi panel",
        createdAt: now,
        updatedAt: now,
      },
      {
        activity_id: 1,
        type: "youtube",
        value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        order: 2,
        caption: "Dokumentasi lengkap seminar",
        createdAt: now,
        updatedAt: now,
      },

      // Activity 2 — image + youtube
      {
        activity_id: 2,
        type: "image",
        value: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
        order: 0,
        caption: "Peserta workshop",
        createdAt: now,
        updatedAt: now,
      },
      {
        activity_id: 2,
        type: "youtube",
        value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        order: 1,
        caption: "Highlight workshop",
        createdAt: now,
        updatedAt: now,
      },

      // Activity 3 — image saja (draft)
      {
        activity_id: 3,
        type: "image",
        value: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800",
        order: 0,
        caption: null,
        createdAt: now,
        updatedAt: now,
      },

      {
        activity_id: 4,
        type: "image",
        value: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800", // sama dengan image thumbnail
        order: 0,
        caption: "Persiapan pelatihan fasilitator",
        createdAt: now,
        updatedAt: now,
      },
      {
        activity_id: 4,
        type: "youtube",
        value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        order: 1,
        caption: "Preview materi pelatihan",
        createdAt: now,
        updatedAt: now,
      },
    ], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("ActivityMedia", {
      activity_id: [1, 2, 3, 4]
    }, {});
    await queryInterface.bulkDelete("Activities", {
      id: [1, 2, 3, 4]
    }, {});
  },
};