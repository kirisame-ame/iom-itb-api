/**
 * @swagger
 *
 * /notifications/payments:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get payment notifications
 *     tags: [Notifications]
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
 *     responses:
 *       200:
 *         description: List of payment notifications
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /notifications/payments/read:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Mark payment notifications as read
 *     tags: [Notifications]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of notification IDs to mark as read
 *     responses:
 *       200:
 *         description: Notifications marked as read
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */