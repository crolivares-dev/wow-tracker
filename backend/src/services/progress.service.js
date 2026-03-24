// ============================================================
// services/progress.service.js
// Lógica de negocio para el progreso semanal.
// ============================================================

const { db }               = require("../db/connection");
const { validateProgress } = require("../models/progress.model");
const { randomUUID }       = require("crypto");

const progressService = {
  /**
   * Retorna todos los registros de progreso indexados por characterId.
   * @returns {Promise<Object.<string, object>>}
   */
  getAll: async () => {
    // DB real:
    // SELECT * FROM weekly_progress
    // → transformar array a mapa { [character_id]: row }
    return { ...db.progress };
  },

  /**
   * Retorna el progreso de un personaje para una semana dada.
   * @param {string} characterId
   * @param {string} weekId
   * @returns {Promise<object|null>}
   */
  getByCharacterAndWeek: async (characterId, weekId) => {
    // DB real:
    // SELECT * FROM weekly_progress
    // WHERE character_id = $1 AND week_id = $2
    const entry = db.progress[characterId];
    if (!entry || entry.weekId !== weekId) return null;
    return entry;
  },

  /**
   * Crea o actualiza (upsert) el progreso de un personaje.
   * @param {object} data
   * @returns {Promise<object>}
   */
  upsert: async (data) => {
    const { valid, errors } = validateProgress(data);
    if (!valid) throw new Error(`Validación fallida: ${errors.join(", ")}`);

    // DB real:
    // INSERT INTO weekly_progress (...) VALUES (...)
    // ON CONFLICT (character_id, week_id)
    // DO UPDATE SET abismos=$3, lfr=$4, ... RETURNING *
    const existing = db.progress[data.characterId];
    const upserted = {
      ...data,
      id: existing?.id ?? randomUUID(),
    };
    db.progress[data.characterId] = upserted;
    return upserted;
  },

  /**
   * Reinicia el progreso de una lista de personajes para una semana.
   * @param {string[]} characterIds
   * @param {string}   weekId
   * @returns {Promise<void>}
   */
  resetWeek: async (characterIds, weekId) => {
    // DB real:
    // UPDATE weekly_progress
    // SET abismos=0, lfr=false, normal_bosses='{}', ...
    // WHERE character_id = ANY($1) AND week_id = $2
    characterIds.forEach((id) => {
      db.progress[id] = {
        id:           db.progress[id]?.id ?? randomUUID(),
        characterId:  id,
        weekId,
        abismos:      0,
        lfr:          false,
        normalBosses: [],
        heroicBosses: [],
        hunt:         false,
        weeklyQuest:  false,
        knowledge:    0,
      };
    });
  },
};

module.exports = { progressService };
