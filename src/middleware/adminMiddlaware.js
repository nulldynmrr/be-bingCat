const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ status: "error", message: "Token tidak ditemukan." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "bincat_secret_key",
    );
    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ status: "error", message: "Akses ditolak. Khusus Admin." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: "error", message: "Token tidak valid." });
  }
};

module.exports = adminMiddleware;
