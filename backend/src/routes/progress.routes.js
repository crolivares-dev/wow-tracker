// ============================================================
// routes/progress.routes.js
// IMPORTANTE: /reset debe ir ANTES de /:id para que Express
// no lo interprete como un parámetro dinámico.
// ============================================================

const { Router }             = require("express");
const { progressController } = require("../controllers/progress.controller");

const router = Router();

router.get("/",       progressController.getAll);
router.post("/reset", progressController.resetWeek);
router.post("/",      progressController.upsert);

module.exports = router;
