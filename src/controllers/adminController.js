const adminService = require("../services/adminService");

class AdminController {
  async getDashboard(req, res) {
    try {
      const data = await adminService.getDashboardStats();
      res.status(200).json({ status: "success", data });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  async getQuestions(req, res) {
    try {
      const { q, type } = req.query;
      const data = await adminService.getQuestions(q, type);
      res.status(200).json({ status: "success", data });
    } catch (err) {
      res.status(500).json({ status: "error", message: err.message });
    }
  }

  async addQuestion(req, res) {
    try {
      const data = await adminService.addQuestion(req.body);
      res.status(201).json({
        status: "success",
        message: "Soal berhasil ditambahkan",
        data,
      });
    } catch (err) {
      res.status(400).json({ status: "error", message: err.message });
    }
  }

  async uploadQuestions(req, res) {
    try {
      const count = await adminService.uploadQuestions(req.body);
      res.status(201).json({
        status: "success",
        message: `${count} soal berhasil diunggah`,
      });
    } catch (err) {
      res
        .status(400)
        .json({ status: "error", message: "Gagal mengunggah JSON soal" });
    }
  }
}

module.exports = new AdminController();
