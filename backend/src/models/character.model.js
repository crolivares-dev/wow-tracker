// ============================================================
// models/character.model.js
// Define la estructura esperada de un Character.
// Cuando se conecte a PostgreSQL, aquí irá el schema de Sequelize
// o el objeto de tabla de Supabase.
// ============================================================

/**
 * @typedef {Object} Character
 * @property {string}   id
 * @property {string}   owner       - "Cristian" | "Natalia"
 * @property {string}   name
 * @property {number}   level
 * @property {number}   itemLevel
 * @property {string}   faction     - "Alliance" | "Horde"
 * @property {string}   realm
 * @property {string}   class
 * @property {string}   spec
 * @property {string[]} professions
 */

/**
 * Valida que un objeto tenga los campos requeridos para crear un Character.
 * @param {object} data
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateCharacter(data) {
  const errors = [];
  if (!data.name?.trim())    errors.push("name es requerido");
  if (!data.owner)           errors.push("owner es requerido");
  if (!data.class)           errors.push("class es requerido");
  if (!data.faction)         errors.push("faction es requerido");
  if (data.level < 1)        errors.push("level debe ser >= 1");
  return { valid: errors.length === 0, errors };
}

// ── SQL para PostgreSQL (referencia, no ejecutado aún) ────────
//
// CREATE TABLE characters (
//   id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   owner       VARCHAR(50)  NOT NULL,
//   name        VARCHAR(100) NOT NULL,
//   level       INTEGER      NOT NULL DEFAULT 1,
//   item_level  INTEGER      NOT NULL DEFAULT 0,
//   faction     VARCHAR(20)  NOT NULL,
//   realm       VARCHAR(100) NOT NULL,
//   class       VARCHAR(50)  NOT NULL,
//   spec        VARCHAR(50),
//   professions TEXT[],
//   created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
//   updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
// );

module.exports = { validateCharacter };
