// ============================================================
// controllers/character.controller.js
// Recibe requests HTTP, delega al service, devuelve respuesta.
// No contiene lógica de negocio — solo orquesta.
// ============================================================

const { characterService } = require("../services/character.service");

const characterController = {
  /**
   * GET /api/characters
   */
  getAll: async (req, res, next) => {
    try {
      const characters = await characterService.getAll();
      res.json(characters);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/characters/:id
   */
  getById: async (req, res, next) => {
    try {
      const char = await characterService.getById(req.params.id);
      if (!char) return res.status(404).json({ message: "Personaje no encontrado" });
      res.json(char);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/characters
   */
  create: async (req, res, next) => {
    try {
      const newChar = await characterService.create(req.body);
      res.status(201).json(newChar);
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/characters/:id
   */
  update: async (req, res, next) => {
    try {
      const updated = await characterService.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/characters/:id
   */
  delete: async (req, res, next) => {
    try {
      await characterService.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = { characterController };
