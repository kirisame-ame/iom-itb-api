/**
 * @swagger
 *
 * /kegiatan-kemitraan:
 *   get:
 *     summary: Get all kegiatan kemitraan
 *     tags: [KegiatanKemitraan]
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
 *         description: A list of kegiatan kemitraan
 *       500:
 *         description: Internal Server Error
 *
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create new kegiatan kemitraan
 *     tags: [KegiatanKemitraan]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               kemitraanId:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Kegiatan created
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /kegiatan-kemitraan/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update kegiatan kemitraan
 *     tags: [KegiatanKemitraan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               kemitraanId:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Kegiatan updated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete kegiatan kemitraan
 *     tags: [KegiatanKemitraan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kegiatan deleted
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */