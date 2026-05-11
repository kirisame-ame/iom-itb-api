/**
 * @swagger
 *
 * /dana-bantuan:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all dana bantuan
 *     tags: [DanaBantuan]
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
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of dana bantuan
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create new dana bantuan
 *     tags: [DanaBantuan]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_dana:
 *                 type: string
 *               id_penerima:
 *                 type: string
 *               jenis_bantuan:
 *                 type: string
 *               bulan:
 *                 type: string
 *               tahun:
 *                 type: string
 *               jumlah_donasi:
 *                 type: number
 *     responses:
 *       201:
 *         description: Dana bantuan created
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /dana-bantuan/{id}:
 *   get:
 *     summary: Get dana bantuan by ID
 *     tags: [DanaBantuan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dana bantuan detail
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 *
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update dana bantuan
 *     tags: [DanaBantuan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_dana:
 *                 type: string
 *               id_penerima:
 *                 type: string
 *               jenis_bantuan:
 *                 type: string
 *               bulan:
 *                 type: string
 *               tahun:
 *                 type: string
 *               jumlah_donasi:
 *                 type: number
 *     responses:
 *       200:
 *         description: Dana bantuan updated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete dana bantuan
 *     tags: [DanaBantuan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dana bantuan deleted
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */