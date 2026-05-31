/**
 * @swagger
 *
 * /images/upload:
 *   post:
 *     summary: Upload image
 *     tags: [Image]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (jpeg, png, gif, webp)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       500:
 *         description: Internal Server Error
 */