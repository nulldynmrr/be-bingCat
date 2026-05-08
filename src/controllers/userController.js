const userService = require("../services/userService");

class UserController {
  async getDashboard(req, res) {
    try {
      const data = await userService.getDashboard(req.user.userId);
      res.status(200).json({ status: "success", data });
    } catch (err) {
      res.status(404).json({ status: "error", message: err.message });
    }
  }

  async getChapter(req, res) {
    try {
      const chapterId = parseInt(req.params.id);
      const data = await userService.getChapterMetadata(chapterId);
      res.status(200).json({ status: "success", data });
    } catch (err) {
      res.status(404).json({ status: "error", message: err.message });
    }
  }

  async getLeaderboard(req, res) {
    try {
      const data = await userService.getLeaderboard();
      res.status(200).json({ status: "success", data });
    } catch (err) {
      res
        .status(500)
        .json({ status: "error", message: "Gagal memuat leaderboard" });
    }
  }

  async getProfile(req, res) {
    try {
      const data = await userService.getProfile(req.user.userId);
      res.status(200).json({ status: "success", data });
    } catch (err) {
      res.status(404).json({ status: "error", message: err.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const data = await userService.updateProfile(req.user.userId, req.body);
      res.status(200).json({
        status: "success",
        message: "Profil berhasil diperbarui",
        data,
      });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  }

  async changePassword(req, res) {
    try {
      const { old_password, new_password } = req.body;
      await userService.changePassword(
        req.user.userId,
        old_password,
        new_password,
      );
      res
        .status(200)
        .json({ status: "success", message: "Password berhasil diubah" });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  }

  async updateProgress(req, res) {
    try {
      const { chapter_id, progress_percent, is_completed } = req.body;
      const data = await userService.updateProgress(
        req.user.userId,
        parseInt(chapter_id),
        progress_percent,
        is_completed,
      );
      res
        .status(200)
        .json({ status: "success", message: "Progress disimpan", data });
    } catch (err) {
      res
        .status(400)
        .json({ status: "error", message: "Gagal menyimpan progress" });
    }
  }

  // ... (Method yang lama biarkan)

  async getQuestions(req, res) {
    try {
      const data = await userService.getQuestions(parseInt(req.params.id));
      res.status(200).json({ status: "success", data });
    } catch (err) {
      res.status(404).json({ status: "error", message: err.message });
    }
  }

  async searchFriends(req, res) {
    try {
      const keyword = req.query.q;
      const data = await userService.searchFriends(req.user.userId, keyword);
      res.status(200).json({ status: "success", data });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  }

  async saveOnboarding(req, res) {
    try {
      const { level } = req.body;
      const data = await userService.saveOnboarding(req.user.userId, level);
      res
        .status(200)
        .json({ status: "success", message: "Onboarding tersimpan", data });
    } catch (err) {
      res
        .status(400)
        .json({ status: "error", message: "Gagal menyimpan onboarding" });
    }
  }

  async askAITutor(req, res) {
    try {
      const { question } = req.body;
      const data = await userService.askAITutor(req.user.userId, question);
      res.status(200).json({ status: "success", data });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "AI Tutor sedang tidur. Coba lagi nanti!",
      });
    }
  }

  async checkAnswer(req, res) {
    try {
      const questionId = req.params.id;
      const { user_answer } = req.body;

      if (!user_answer) {
        return res.status(400).json({
          status: "error",
          message: "Jawaban user (user_answer) wajib dikirim",
        });
      }

      const data = await userService.checkAnswer(questionId, user_answer);
      res.status(200).json({ status: "success", data });
    } catch (err) {
      res.status(404).json({ status: "error", message: err.message });
    }
  }
}

module.exports = new UserController();
