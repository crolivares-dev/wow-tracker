// ============================================================
// routes/character.routes.js
// ============================================================

const { Router }               = require("express");
const { characterController }  = require("../controllers/character.controller");

const router = Router();

router.get("/",      characterController.getAll);
router.get("/:id",   characterController.getById);
router.post("/",     characterController.create);
router.put("/:id",   characterController.update);
router.delete("/:id",characterController.delete);

module.exports = router;
