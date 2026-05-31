/**
 * @swagger
 *
 * /faculties:
 *   get:
 *     summary: Get all faculties
 *     tags: [Faculties]
 *     responses:
 *       200:
 *         description: A list of faculties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       kodeUnik:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *       500:
 *         description: Internal Server Error
 *
 *   post:
 *     summary: Create new faculty
 *     tags: [Faculties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: FTMD
 *               kodeUnik:
 *                 type: integer
 *                 example: 100
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Faculty created
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 *
 * /faculties/{id}:
 *   put:
 *     summary: Update faculty
 *     tags: [Faculties]
 *     security:
 *       - bearerAuth: []
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
 *               name:
 *                 type: string
 *               kodeUnik:
 *                 type: integer
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Faculty updated
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 *
 *   delete:
 *     summary: Delete faculty
 *     tags: [Faculties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Faculty deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */