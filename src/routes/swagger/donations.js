/**
 * @swagger
 *
 * /donations:
 *   get:
 *     summary: Get all donations (public)
 *     tags: [Donations]
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
 *         description: A list of donations
 *       500:
 *         description: Internal Server Error
 *
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create new donation
 *     tags: [Donations]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               noWhatsapp:
 *                 type: string
 *                 example: 08123456789
 *               amount:
 *                 type: number
 *                 example: 100000
 *               donationType:
 *                 type: string
 *                 example: sekali
 *               facultyId:
 *                 type: string
 *               proof:
 *                 type: file
 *     responses:
 *       201:
 *         description: Donation created
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /donations/admin:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all donations (admin)
 *     tags: [Donations]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: length
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of all donations
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /donations/{id}:
 *   get:
 *     summary: Get donation by ID
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Donation detail
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 *
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update donation
 *     tags: [Donations]
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
 *               email:
 *                 type: string
 *               noWhatsapp:
 *                 type: string
 *               amount:
 *                 type: number
 *               donationType:
 *                 type: string
 *               facultyId:
 *                 type: string
 *               paymentStatus:
 *                 type: string
 *               proof:
 *                 type: file
 *     responses:
 *       200:
 *         description: Donation updated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete donation
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Donation deleted
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */