const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthService {
  async register(data) {
    const existing = await prisma.profile.findUnique({
      where: { email: data.email },
    });
    if (existing) throw new Error("Email sudah terdaftar!");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const role = data.email.includes("admin") ? "admin" : "user";

    return await prisma.profile.create({
      data: {
        full_name: data.full_name,
        email: data.email,
        password: hashedPassword,
        role: role,
      },
    });
  }

  async login(email, password) {
    const user = await prisma.profile.findUnique({ where: { email } });
    if (!user) throw new Error("Email atau password salah");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Email atau password salah");

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return {
      token,
      role: user.role,
      user: { id: user.id, name: user.full_name, email: user.email },
    };
  }
}

module.exports = new AuthService();
