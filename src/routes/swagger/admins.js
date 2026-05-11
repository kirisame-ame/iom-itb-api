/**
 * @swagger
 *
 * /admins:
 *   post:
 *     summary: Create new admin
 *     tags: [Admins]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@iom.com
 *               password:
 *                 type: string
 *                 example: admin123
 *               name:
 *                 type: string
 *                 example: Admin IOM
 *     responses:
 *       201:
 *         description: Admin created
 *       500:
 *         description: Internal Server Error
 */