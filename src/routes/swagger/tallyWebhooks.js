/**
 * @swagger
 *
 * /webhooks/tally/pendaftaran-anggota:
 *   post:
 *     summary: Handle Tally form submission for member registration
 *     tags: [TallyWebhooks]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Tally webhook payload for pendaftaran anggota form
 *     responses:
 *       200:
 *         description: Webhook handled
 *       500:
 *         description: Internal Server Error
 *
 * /webhooks/tally/pengajuan-bantuan:
 *   post:
 *     summary: Handle Tally form submission for bantuan request
 *     tags: [TallyWebhooks]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Tally webhook payload for pengajuan bantuan form
 *     responses:
 *       200:
 *         description: Webhook handled
 *       500:
 *         description: Internal Server Error
 *
 * /webhooks/tally/orangtua-asuh:
 *   post:
 *     summary: Handle Tally form submission for Orang Tua Asuh program
 *     tags: [TallyWebhooks]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Tally webhook payload for Orang Tua Asuh form
 *     responses:
 *       200:
 *         description: Webhook handled
 *       500:
 *         description: Internal Server Error
 */