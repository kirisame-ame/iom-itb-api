'use strict';

// Mock data untuk disepakati dengan tim Bankes & OTA (API Contract)
// Jika mereka sudah deploy, kita tinggal hapus file ini dan ganti URL di frontend.
module.exports = {
  // Endpoint 1: Daftar Mahasiswa terkait Bankes/OTA
  async getMahasiswa(req, res) {
    const mockData = [
      {
        id: "mhs-1",
        nim: "13520001",
        name: "Budi Santoso",
        faculty: "STEI",
        major: "Teknik_Informatika",
        gpa: 3.85,
        bankesStatus: "verified",
        billAmount: 0,
        applicationStatus: "pending"
      },
      {
        id: "mhs-2",
        nim: "19920002",
        name: "Siti Aminah",
        faculty: "SAPPK",
        major: "Perencanaan_Wilayah_dan_Kota",
        gpa: 3.60,
        bankesStatus: "unverified",
        billAmount: 5000000,
        applicationStatus: "accepted"
      }
    ];
    
    return res.status(200).json({
      status: "success",
      message: "Data ditarik dari MOCK API IOM",
      data: mockData
    });
  },

  // Endpoint 2: Daftar Orang Tua Asuh (OTA)
  async getOta(req, res) {
    const mockData = [
      {
        id: "ota-1",
        name: "Bapak Ahmad Suryadi",
        job: "Direktur BUMN",
        funds: 10000000,
        maxCapacity: 2,
        criteria: "Mahasiswa tingkat akhir dari Fakultas STEI yang kurang mampu.",
        isDetailVisible: true
      },
      {
        id: "ota-2",
        name: "Ibu Rina Melati",
        job: "Pengusaha",
        funds: 5000000,
        maxCapacity: 1,
        criteria: "Bebas, IPK minimal 3.0",
        isDetailVisible: false
      }
    ];

    return res.status(200).json({
      status: "success",
      message: "Data ditarik dari MOCK API IOM",
      data: mockData
    });
  }
};
