const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

/**
 * @openapi
 * /api/user/dashboard:
 *   get:
 *     tags:
 *       - Learner
 *     summary: Mengambil data Dashboard & Map
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil memuat dashboard
 */
router.get("/dashboard", (req, res) => userController.getDashboard(req, res));

/**
 * @openapi
 * /api/user/profile:
 *   get:
 *     tags:
 *       - Learner
 *     summary: Mengambil detail profil, pencapaian & teman
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil memuat profil
 */
router.get("/profile", (req, res) => userController.getProfile(req, res));

/**
 * @openapi
 * /api/user/leaderboard:
 *   get:
 *     tags:
 *       - Learner
 *     summary: Mengambil daftar ranking Liga
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil memuat leaderboard
 */
router.get("/leaderboard", (req, res) =>
  userController.getLeaderboard(req, res),
);

/**
 * @openapi
 * /api/user/chapters/{id}:
 *   get:
 *     tags:
 *       - Learner
 *     summary: Mengambil metadata detail bab dari agregasi soal
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Metadata bab dimuat
 */
router.get("/chapters/:id", (req, res) => userController.getChapter(req, res));

/**
 * @openapi
 * /api/user/profile:
 *   put:
 *     tags:
 *       - Learner
 *     summary: Update data dasar profil mahasiswa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               university:
 *                 type: string
 *               major:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil diperbarui
 */
router.put("/profile", (req, res) => userController.updateProfile(req, res));

/**
 * @openapi
 * /api/user/change-password:
 *   put:
 *     tags:
 *       - Learner
 *     summary: Ubah password mahasiswa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               old_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password berhasil diubah
 */
router.put("/change-password", (req, res) =>
  userController.changePassword(req, res),
);

/**
 * @openapi
 * /api/user/progress:
 *   post:
 *     tags:
 *       - Learner
 *     summary: Simpan progress kuis dan berikan XP/Gems
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
 *               progress_percent:
 *                 type: integer
 *               is_completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Progress tersimpan
 */
router.post("/progress", (req, res) => userController.updateProgress(req, res));

/**
 * @openapi
 * /api/user/chapters/{id}/questions:
 *   get:
 *     tags:
 *       - Learner
 *     summary: Mengambil daftar soal untuk kuis
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil memuat soal (tanpa kunci jawaban)
 */
router.get("/chapters/:id/questions", (req, res) =>
  userController.getQuestions(req, res),
);

/**
 * @openapi
 * /api/user/friends/search:
 *   get:
 *     tags:
 *       - Learner
 *     summary: Mencari teman berdasarkan nama
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Keyword nama teman
 *     responses:
 *       200:
 *         description: Hasil pencarian teman
 */
router.get("/friends/search", (req, res) =>
  userController.searchFriends(req, res),
);

/**
 * @openapi
 * /api/user/onboarding:
 *   put:
 *     tags:
 *       - Learner
 *     summary: Menyimpan level onboarding user baru
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               level:
 *                 type: string
 *                 example: Beginner
 *     responses:
 *       200:
 *         description: Onboarding tersimpan
 */
router.put("/onboarding", (req, res) =>
  userController.saveOnboarding(req, res),
);

/**
 * @openapi
 * /api/user/ai-tutor:
 *   post:
 *     tags:
 *       - Learner
 *     summary: Chat dengan AI Tutor binCat (Groq LLM)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *     responses:
 *       200:
 *         description: Balasan dari AI Tutor
 */
router.post("/ai-tutor", (req, res) => userController.askAITutor(req, res));

module.exports = router;
