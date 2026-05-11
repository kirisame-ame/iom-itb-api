/**
 * @swagger
 *
 * /competition/findCompetition:
 *   get:
 *     summary: Get all competitions
 *     tags: [Competitions]
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
 *         description: A list of competitions
 *       500:
 *         description: Internal Server Error
 *
 * /competition/findCompetitionRegistration:
 *   get:
 *     summary: Get competition registrations
 *     tags: [Competitions]
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
 *         description: List of registrations
 *       500:
 *         description: Internal Server Error
 *
 * /competition/findScheduleCompetition:
 *   get:
 *     summary: Get competition schedules
 *     tags: [Competitions]
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
 *         description: List of schedules
 *       500:
 *         description: Internal Server Error
 *
 * /competition/findSubmission:
 *   get:
 *     summary: Get competition submissions
 *     tags: [Competitions]
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
 *         description: List of submissions
 *       500:
 *         description: Internal Server Error
 *
 * /competition/registerCompetition:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Register a new competition (EO only)
 *     tags: [Competitions]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - date
 *             properties:
 *               banner:
 *                 type: file
 *               name:
 *                 type: string
 *                 example: Programming Challenge
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               category:
 *                 type: string
 *               time:
 *                 type: string
 *               location:
 *                 type: string
 *               platform:
 *                 type: string
 *               mentors:
 *                 type: string
 *                 description: JSON array of mentor emails
 *               sponsors:
 *                 type: string
 *                 description: JSON array of sponsor emails
 *     responses:
 *       201:
 *         description: Competition registered
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /competition/schedule:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create competition schedule (EO only)
 *     tags: [Competitions]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - date
 *               - competitionId
 *             properties:
 *               name:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               category:
 *                 type: string
 *               time:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               competitionId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Schedule created
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /competition/register/peserta:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Register competition participant (Siswa/Mahasiswa)
 *     tags: [Competitions]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - competitionId
 *               - nameTeam
 *               - domicile
 *               - phoneNumber
 *             properties:
 *               competitionId:
 *                 type: string
 *                 format: uuid
 *               nameTeam:
 *                 type: string
 *               domicile:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               supportingDocuments:
 *                 type: file
 *               isTeam:
 *                 type: boolean
 *               teamSize:
 *                 type: integer
 *               teamMembers:
 *                 type: string
 *                 description: JSON array of team member names
 *     responses:
 *       201:
 *         description: Registration successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /competition/submission:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Submit competition work (Siswa/Mahasiswa)
 *     tags: [Competitions]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registrationId
 *               - url
 *             properties:
 *               registrationId:
 *                 type: string
 *               url:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Submission successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /competition/updateScheduleCompetition/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update competition schedule (EO only)
 *     tags: [Competitions]
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
 *               date:
 *                 type: string
 *                 format: date
 *               category:
 *                 type: string
 *               time:
 *                 type: string
 *               location:
 *                 type: string
 *               description:
 *                 type: string
 *               competitionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Schedule updated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 *
 * /competition/deleteScheduleCompetition/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete competition schedule (EO only)
 *     tags: [Competitions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Schedule deleted
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */