/**
 * @swagger
 *
 * /tally-submissions/form/{formSlug}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: List submissions by form slug
 *     tags: [TallySubmissions]
 *     parameters:
 *       - in: path
 *         name: formSlug
 *         required: true
 *         schema:
 *           type: string
 *         description: Tally form slug
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
 *     responses:
 *       200:
 *         description: List of submissions
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /tally-submissions/form/{formSlug}/{tallySubmissionId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get submission by ID
 *     tags: [TallySubmissions]
 *     parameters:
 *       - in: path
 *         name: formSlug
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: tallySubmissionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Submission detail
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /tally-submissions/form/{formSlug}/{tallySubmissionId}/whatsapp:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Send WhatsApp notification for submission
 *     tags: [TallySubmissions]
 *     parameters:
 *       - in: path
 *         name: formSlug
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: tallySubmissionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: WhatsApp sent
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /tally-submissions/pengajuan-bantuan/{tallySubmissionId}/status:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     summary: Update pengajuan bantuan status
 *     tags: [TallySubmissions]
 *     parameters:
 *       - in: path
 *         name: tallySubmissionId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: approved
 *     responses:
 *       200:
 *         description: Status updated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */