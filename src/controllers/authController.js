const authService = require("../services/authService");
const { signup, login } = require("../schemas/validation");

class AuthController {
  // Method Register
  async register(req, res) {
    try {
      const validatedData = signup.parse(req.body);
      const user = await authService.register(validatedData);
      return res.status(201).json({
        status: "success",
        message: "Akun berhasil dibuat",
        data: { id: user.id, email: user.email },
      });
    } catch (err) {
      return res.status(400).json({ status: "error", message: err.message });
    }
  }

  // Method Login
  async login(req, res) {
    try {
      const validatedData = login.parse(req.body);
      const result = await authService.login(
        validatedData.email,
        validatedData.password,
      );
      return res.json({
        status: "success",
        message: "Login berhasil",
        data: result,
      });
    } catch (err) {
      return res.status(401).json({ status: "error", message: err.message });
    }
  }
}

// Pastikan di-export sebagai instance baru
module.exports = new AuthController();
