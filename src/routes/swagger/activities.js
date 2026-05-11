/**
 * @swagger
 *
 * /activities:
 *   get:
 *     summary: Get all activities (public)
 *     tags: [Activities]
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
 *         description: A list of activities
 *       500:
 *         description: Internal Server Error
 *
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create new activity
 *     tags: [Activities]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Workshop Coding
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2024-07-20
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *               status:
 *                 type: string
 *                 example: active
 *               image:
 *                 type: string
 *                 format: binary
 *               tags:
 *                 type: string
 *                 description: Comma-separated tag names
 *     responses:
 *       201:
 *         description: Activity created
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /activities/tags:
 *   get:
 *     summary: Get all activity tags
 *     tags: [Activities]
 *     responses:
 *       200:
 *         description: List of tags
 *       500:
 *         description: Internal Server Error
 *
 * /activities/{slug}:
 *   get:
 *     summary: Get activity by slug
 *     tags: [Activities]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity detail
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 *
 * /activities/admin/all:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all activities (admin)
 *     tags: [Activities]
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
 *         description: List of all activities
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /activities/admin/id/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get activity by ID (admin)
 *     tags: [Activities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity detail
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /activities/admin/counts:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get activity counts
 *     tags: [Activities]
 *     responses:
 *       200:
 *         description: Activity counts
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /activities/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update activity
 *     tags: [Activities]
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
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               url:
 *                 type: string
 *               status:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               tags:
 *                 type: string
 *     responses:
 *       200:
 *         description: Activity updated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete activity
 *     tags: [Activities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity deleted
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */