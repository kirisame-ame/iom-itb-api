/**
 * @swagger
 *
 * /dashboard/stats:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /dashboard/charts:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get dashboard charts data
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Charts data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /dashboard/recent:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get recent items
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Recent items list
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /dashboard/payments:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get payment monitoring
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Payment monitoring data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */