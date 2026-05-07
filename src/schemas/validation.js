const { z } = require("zod");

const authSchemas = {
  signup: z.object({
    full_name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
  }),

  login: z.object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(1, "Password wajib diisi"),
  }),
};

module.exports = authSchemas;
