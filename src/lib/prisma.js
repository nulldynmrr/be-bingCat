// src/lib/prisma.js
const { PrismaClient } = require("@prisma/client");
require("dotenv").config(); // Pastikan dotenv dimuat

const prisma = new PrismaClient({
  // Masukkan URL langsung dari env ke sini untuk Prisma 7
  datasourceUrl: process.env.DATABASE_URL,
});

module.exports = prisma;
