/**
 * @swagger
 *
 * /kemitraan:
 *   get:
 *     summary: Get all kemitraan
 *     tags: [Kemitraan]
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
 *         description: A list of kemitraan
 *       500:
 *         description: Internal Server Error
 *
 *   post:
 *     summary: Create new kemitraan
 *     tags: [Kemitraan]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: PT ABC
 *               description:
 *                 type: string
 *               picName:
 *                 type: string
 *               picPhone:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *               file:
 *                 type: string
 *                 format: binary
 *               mou:
 *                 type: string
 *                 description: Path to MOU file
 *     responses:
 *       201:
 *         description: Kemitraan created
 *       500:
 *         description: Internal Server Error
 *
 * /kemitraan/{id}:
 *   get:
 *     summary: Get kemitraan by ID
 *     tags: [Kemitraan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kemitraan detail
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 *
 *   put:
 *     summary: Update kemitraan
 *     tags: [Kemitraan]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               picName:
 *                 type: string
 *               picPhone:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *               file:
 *                 type: string
 *                 format: binary
 *               mou:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kemitraan updated
 *       500:
 *         description: Internal Server Error
 *
 *   delete:
 *     summary: Delete kemitraan
 *     tags: [Kemitraan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kemitraan deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */