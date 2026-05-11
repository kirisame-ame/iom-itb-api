/**
 * @swagger
 *
 * /file/upload:
 *   post:
 *     summary: Upload file
 *     tags: [File]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload
 *     responses:
 *       200:
 *         description: File uploaded
 *       500:
 *         description: Internal Server Error
 *
 * /file/download:
 *   get:
 *     summary: Download file
 *     tags: [File]
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: File path
 *     responses:
 *       200:
 *         description: File download
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal Server Error
 *
 * /file/preview:
 *   get:
 *     summary: Preview file
 *     tags: [File]
 *     parameters:
 *       - in: query
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: File path
 *     responses:
 *       200:
 *         description: File preview
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal Server Error
 *
 * /file/images/upload:
 *   post:
 *     summary: Upload image
 *     tags: [File]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded
 *       500:
 *         description: Internal Server Error
 */