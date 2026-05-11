/**
 * @swagger
 *
 * /merchandises/categories:
 *   get:
 *     summary: Get merchandise categories
 *     tags: [Merchandise]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Internal Server Error
 *
 * /merchandises:
 *   get:
 *     summary: Get all merchandise
 *     tags: [Merchandise]
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
 *         description: A list of merchandise
 *       500:
 *         description: Internal Server Error
 *
 *   post:
 *     summary: Create new merchandise
 *     tags: [Merchandise]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: T-Shirt
 *               description:
 *                 type: string
 *                 example: Cool t-shirt
 *               price:
 *                 type: number
 *                 example: 100000
 *               stock:
 *                 type: integer
 *                 example: 100
 *               link:
 *                 type: string
 *                 example: https://example.com
 *               kategori:
 *                 type: string
 *                 example: Busana
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Merchandise created
 *       500:
 *         description: Internal Server Error
 *
 * /merchandises/{id}:
 *   get:
 *     summary: Get merchandise by ID
 *     tags: [Merchandise]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Merchandise detail
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 *
 *   put:
 *     summary: Update merchandise
 *     tags: [Merchandise]
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               link:
 *                 type: string
 *               kategori:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Merchandise updated
 *       500:
 *         description: Internal Server Error
 *
 *   delete:
 *     summary: Delete merchandise
 *     tags: [Merchandise]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Merchandise deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal Server Error
 */