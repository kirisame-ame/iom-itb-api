/**
 * @swagger
 *
 * /help-submissions:
 *   get:
 *     summary: Get all help submissions
 *     tags: [HelpSubmissions]
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
 *         description: A list of help submissions
 *       500:
 *         description: Internal Server Error
 *
 *   post:
 *     summary: Create new help submission
 *     tags: [HelpSubmissions]
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
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Help submission created
 *       500:
 *         description: Internal Server Error
 *
 * /help-submissions/{id}:
 *   get:
 *     summary: Get help submission by ID
 *     tags: [HelpSubmissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Help submission detail
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 *
 *   put:
 *     summary: Update help submission
 *     tags: [HelpSubmissions]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *               status:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Help submission updated
 *       500:
 *         description: Internal Server Error
 *
 *   delete:
 *     summary: Delete help submission
 *     tags: [HelpSubmissions]
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
 *         description: Help submission deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */