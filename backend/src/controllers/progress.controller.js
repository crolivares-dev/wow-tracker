// ============================================================
// controllers/progress.controller.js
// ============================================================

const { progressService } = require("../services/progress.service");

const progressController = {
  /**
   * GET /api/progress
   * Retorna todos los registros indexados por characterId.
   */
  getAll: async (req, res, next) => {
    try {
      const progressMap = await progressService.getAll();
      res.json(progressMap);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/progress
   * Crea o actualiza el progreso de un personaje (upsert).
   * Body: WeeklyProgress
   */
  upsert: async (req, res, next) => {
    try {
      const result = await progressService.upsert(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/progress/reset
   * Reinicia el progreso de varios personajes para una semana.
   * Body: { characterIds: string[], weekId: string }
   */
  resetWeek: async (req, res, next) => {
    try {
      const { characterIds, weekId } = req.body;
      if (!Array.isArray(characterIds) || !weekId) {
        return res.status(400).json({ message: "characterIds (array) y weekId son requeridos" });
      }
      await progressService.resetWeek(characterIds, weekId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = { progressController };
