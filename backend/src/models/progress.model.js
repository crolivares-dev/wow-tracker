// ============================================================
// models/progress.model.js
// ============================================================

/**
 * @typedef {Object} RaidProgress
 * @property {boolean}  story
 * @property {boolean}  lfr
 * @property {string[]} normal
 * @property {string[]} heroic
 * @property {boolean}  mythic
 */

/**
 * @typedef {Object} WeeklyProgress
 * @property {string}   id
 * @property {string}   characterId
 * @property {string}   weekId        - "YYYY-WNN"
 * @property {number}   abismos       - 0..4
 * @property {boolean}  hunt
 * @property {boolean}  weeklyQuest
 * @property {number}   knowledge
 * @property {{ voidspire: RaidProgress, dreamrift: RaidProgress, quelDanas: RaidProgress }} raids
 */

function validateProgress(data) {
  const errors = [];
  if (!data.characterId)                     errors.push("characterId es requerido");
  if (!data.weekId)                          errors.push("weekId es requerido");
  if (data.abismos < 0 || data.abismos > 4) errors.push("abismos debe estar entre 0 y 4");
  if (!data.raids || typeof data.raids !== "object") errors.push("raids debe ser un objeto");
  return { valid: errors.length === 0, errors };
}

// ── SQL para PostgreSQL ───────────────────────────────────────
//
// CREATE TABLE weekly_progress (
//   id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
//   character_id   UUID        NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
//   week_id        VARCHAR(10) NOT NULL,
//   abismos        INTEGER     NOT NULL DEFAULT 0,
//   hunt           BOOLEAN     NOT NULL DEFAULT false,
//   weekly_quest   BOOLEAN     NOT NULL DEFAULT false,
//   knowledge      INTEGER     NOT NULL DEFAULT 0,
//   raids          JSONB       NOT NULL DEFAULT '{}',
//   -- raids: { voidspire: {story,lfr,normal[],heroic[],mythic}, dreamrift:{...}, quelDanas:{...} }
//   created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//   updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
//   UNIQUE(character_id, week_id)
// );

module.exports = { validateProgress };
