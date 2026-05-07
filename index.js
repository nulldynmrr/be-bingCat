const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
require("dotenv").config();

const routes = require("./src/routes");

const app = express();

// Middleware Keamanan & Parsing
app.use(helmet());
app.use(cors());
app.use(express.json());

// Konfigurasi Swagger (Gunakan Path Absolut agar tidak meleset)
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "binCat API",
      version: "1.0.0",
      description: "Dokumentasi API untuk Platform Pembelajaran binCat",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
  },
  apis: [path.join(__dirname, "./src/routes/*.js")], // Scan JSDoc di folder routes
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Routes Utama
app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server binCat aktif di: http://localhost:${PORT}`);
  console.log(`✅ Dokumentasi API: http://localhost:${PORT}/api-docs`);
});
