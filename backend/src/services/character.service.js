// ============================================================
// services/character.service.js
// Lógica de negocio para personajes.
// Actualmente opera sobre el mock en memoria.
// Para conectar a DB: reemplazar las operaciones sobre `db`
// por queries SQL o llamadas a Supabase.
// ============================================================

const { db }                 = require("../db/connection");
const { validateCharacter }  = require("../models/character.model");
const { randomUUID }         = require("crypto");

const characterService = {
  /**
   * Retorna todos los personajes.
   * @returns {Promise<object[]>}
   */
  getAll: async () => {
    // DB real: SELECT * FROM characters ORDER BY name ASC
    return [...db.characters];
  },

  /**
   * Retorna un personaje por ID.
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  getById: async (id) => {
    // DB real: SELECT * FROM characters WHERE id = $1
    return db.characters.find((c) => c.id === id) ?? null;
  },

  /**
   * Crea un nuevo personaje.
   * @param {object} data
   * @returns {Promise<object>}
   */
  create: async (data) => {
    const { valid, errors } = validateCharacter(data);
    if (!valid) throw new Error(`Validación fallida: ${errors.join(", ")}`);

    // DB real:
    // INSERT INTO characters (id, owner, name, level, item_level, faction, realm, class, spec, professions)
    // VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
    const newChar = { ...data, id: randomUUID() };
    db.characters.push(newChar);
    return newChar;
  },

  /**
   * Actualiza un personaje existente.
   * @param {string} id
   * @param {object} data
   * @returns {Promise<object>}
   */
  update: async (id, data) => {
    const index = db.characters.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Personaje ${id} no encontrado`);

    // DB real:
    // UPDATE characters SET name=$2, level=$3, ... WHERE id=$1 RETURNING *
    const updated = { ...db.characters[index], ...data, id };
    db.characters[index] = updated;
    return updated;
  },

  /**
   * Elimina un personaje y su progreso asociado.
   * @param {string} id
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    const index = db.characters.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`Personaje ${id} no encontrado`);

    // DB real: DELETE FROM characters WHERE id = $1
    // (ON DELETE CASCADE elimina el progreso automáticamente)
    db.characters.splice(index, 1);
    delete db.progress[id];
  },
};

module.exports = { characterService };
