/**
 * @swagger
 *
 * /broadcast/settings:
 *   get:
 *     summary: Get all broadcast settings
 *     tags: [Broadcast]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of broadcast settings
 *       500:
 *         description: Internal Server Error
 *
 *   post:
 *     summary: Create new broadcast setting
 *     tags: [Broadcast]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Broadcast setting created
 *       500:
 *         description: Internal Server Error
 *
 * /broadcast/settings/{id}:
 *   put:
 *     summary: Update broadcast setting
 *     tags: [Broadcast]
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
 *     responses:
 *       200:
 *         description: Broadcast setting updated
 *       500:
 *         description: Internal Server Error
 *
 *   delete:
 *     summary: Delete broadcast setting
 *     tags: [Broadcast]
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
 *         description: Broadcast setting deleted
 *       500:
 *         description: Internal Server Error
 *
 * /broadcast/run/{id}:
 *   post:
 *     summary: Trigger broadcast execution
 *     tags: [Broadcast]
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
 *         description: Broadcast triggered
 *       500:
 *         description: Internal Server Error
 *
 * /broadcast/logs:
 *   get:
 *     summary: Get broadcast logs
 *     tags: [Broadcast]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Broadcast logs
 *       500:
 *         description: Internal Server Error
 *
 * /broadcast/members:
 *   get:
 *     summary: Get broadcast recipients
 *     tags: [Broadcast]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of members with WA & email
 *       500:
 *         description: Internal Server Error
 */
