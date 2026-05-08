const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const adminMiddleware = require("../middleware/adminMiddleware");

router.use(adminMiddleware);

/**
 * @openapi
 * /api/admin/dashboard:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Mengambil ringkasan statistik Dashboard Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil memuat dashboard
 */
router.get("/dashboard", (req, res) => adminController.getDashboard(req, res));

/**
 * @openapi
 * /api/admin/questions:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Mengambil dan mencari Bank Soal
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian soal
 *
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum:
 *             - listening
 *             - reading
 *             - structure
 *         description: Filter tipe soal
 *
 *     responses:
 *       200:
 *         description: Berhasil memuat daftar soal
 */
router.get("/questions", (req, res) => adminController.getQuestions(req, res));

/**
 * @openapi
 * /api/admin/questions:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Tambah satu soal baru (Structure/Reading/Listening)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chapter_id:
 *                 type: integer
 *
 *               type:
 *                 type: string
 *                 example: listening
 *
 *               context_type:
 *                 type: string
 *                 example: dialogue
 *
 *               context:
 *                 type: object
 *
 *               question_text:
 *                 type: string
 *
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *
 *               correct_answer:
 *                 type: string
 *
 *               explanation:
 *                 type: string
 *
 *     responses:
 *       201:
 *         description: Soal berhasil ditambahkan
 */
router.post("/questions", (req, res) => adminController.addQuestion(req, res));

/**
 * @openapi
 * /api/admin/questions/upload:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Upload masal via JSON Array
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *
 *     responses:
 *       201:
 *         description: Data massal tersimpan
 */
router.post("/questions/upload", (req, res) =>
  adminController.uploadQuestions(req, res),
);

module.exports = router;
