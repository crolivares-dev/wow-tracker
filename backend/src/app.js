// ============================================================
// app.js — Configuración de Express.
// Separado de server.js para facilitar testing.
// ============================================================

const express            = require("express");
const cors               = require("cors");
const characterRoutes    = require("./routes/character.routes");
const progressRoutes     = require("./routes/progress.routes");

const app = express();

// ── Middleware global ─────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// ── Logging básico (reemplazar con morgan/winston en producción) ──
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Health check ─────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Rutas de la API ──────────────────────────────────────────
app.use("/api/characters", characterRoutes);
app.use("/api/progress",   progressRoutes);

// ── 404 ───────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// ── Error handler centralizado ────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  const status  = err.status ?? 500;
  const message = err.message ?? "Error interno del servidor";
  res.status(status).json({ message });
});

module.exports = app;
