/**
 * @swagger
 *
 * /members:
 *   get:
 *     summary: Get all members
 *     tags: [Members]
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
 *         description: A list of members
 *       500:
 *         description: Internal Server Error
 *
 *   post:
 *     summary: Create new member
 *     tags: [Members]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - childNim
 *             properties:
 *               code:
 *                 type: string
 *                 example: MBR001
 *               parentName:
 *                 type: string
 *                 example: John Parent
 *               childNim:
 *                 type: string
 *                 example: 203040111
 *               noWhatsapp:
 *                 type: string
 *                 example: 08123456789
 *               picture:
 *                 type: file
 *               file:
 *                 type: file
 *     responses:
 *       201:
 *         description: Member created
 *       500:
 *         description: Internal Server Error
 *
 * /members/{id}:
 *   get:
 *     summary: Get member by ID
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member detail
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 *
 *   put:
 *     summary: Update member
 *     tags: [Members]
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
 *               code:
 *                 type: string
 *               parentName:
 *                 type: string
 *               childNim:
 *                 type: string
 *               noWhatsapp:
 *                 type: string
 *               picture:
 *                 type: file
 *               file:
 *                 type: file
 *     responses:
 *       200:
 *         description: Member updated
 *       500:
 *         description: Internal Server Error
 *
 *   delete:
 *     summary: Delete member
 *     tags: [Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */