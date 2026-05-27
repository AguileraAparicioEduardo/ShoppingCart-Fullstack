const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const productRoutes = require("./product.routes");
const { swaggerDocs } = require("./swagger");

const app = express();

// ──────────────────────────────────────────────
// CORS — Cross-Origin Resource Sharing
// WHAT IT IS: A browser security mechanism that blocks requests
//   from a different origin (domain/port/protocol) unless the
//   server explicitly allows it.
// WHY WE USE IT: Our frontend (React on port 5173) and backend
//   (Express on port 4000) run on different ports = different origins.
//   Without CORS the browser would block all API requests.
// ──────────────────────────────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ──────────────────────────────────────────────
// Morgan — HTTP request logger (alternative: winston for file logs)
// Logs: method, URL, status code, response time.
// 'dev' format = concise colorized output for development.
// ──────────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ──────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────
app.use("/api/products", productRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Product Manager API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Swagger docs
swaggerDocs(app);

// 404 handler — catch all unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
