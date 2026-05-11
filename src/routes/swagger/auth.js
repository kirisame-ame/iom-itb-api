/**
 * @swagger
 *
 * /auth/me:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get current user info
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Current user data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /auth/apps:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get user apps
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User apps list
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /auth/select:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Select app
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appId:
 *                 type: string
 *                 description: App ID to select
 *     responses:
 *       200:
 *         description: App selected successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /auth/register:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: test123
 *               confirmPassword:
 *                 type: string
 *                 example: test123
 *               roleName:
 *                 type: string
 *                 example: Admin
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-01
 *               gender:
 *                 type: string
 *                 example: Laki_laki
 *               phone:
 *                 type: string
 *                 example: 08123456789
 *               address:
 *                 type: string
 *                 example: Jalan Jendral Sudirman No 1
 *               province:
 *                 type: string
 *                 example: Jawa Barat
 *               regencies:
 *                 type: string
 *                 example: Bandung
 *               image:
 *                 type: string
 *                 format: binary
 *               institutionName:
 *                 type: string
 *                 example: Universitas Pasundan
 *               field:
 *                 type: string
 *                 example: Teknik Informatika
 *               pupils:
 *                 type: string
 *                 example: 203040111
 *               proof:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */