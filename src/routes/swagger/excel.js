/**
 * @swagger
 *
 * /pendataan-anggota:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all pendataan anggota data from Google Sheets
 *     tags: [Excel]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: length
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of pendataan anggota
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /pendataan-anggota/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get pendataan anggota by ID
 *     tags: [Excel]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pendataan anggota detail
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /pengajuan-bantuan:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all pengajuan bantuan data from Google Sheets
 *     tags: [Excel]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: length
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of pengajuan bantuan
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /pengajuan-bantuan/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get pengajuan bantuan by ID
 *     tags: [Excel]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pengajuan bantuan detail
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /orangtua-asuh:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all Orang Tua Asuh data from Google Sheets
 *     tags: [Excel]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: length
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of Orang Tua Asuh
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /orangtua-asuh/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get Orang Tua Asuh by ID
 *     tags: [Excel]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orang Tua Asuh detail
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /donasi:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all donasi data from Google Sheets
 *     tags: [Excel]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: length
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of donasi
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /donasi/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get donasi by ID
 *     tags: [Excel]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Donasi detail
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */