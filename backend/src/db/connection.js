// ============================================================
// db/connection.js
// Gestiona la conexión a la base de datos.
// Actualmente mockeada. Para activar PostgreSQL real:
//   1. npm install pg
//   2. Configurar variables de entorno
//   3. Descomentar el bloque PostgreSQL y eliminar el mock
// ============================================================

// ── OPCIÓN A: PostgreSQL directo (node-postgres) ─────────────
// const { Pool } = require("pg");
//
// const pool = new Pool({
//   host:     process.env.DB_HOST,
//   port:     Number(process.env.DB_PORT) || 5432,
//   database: process.env.DB_NAME,
//   user:     process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   ssl:      process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
// });
//
// pool.on("error", (err) => {
//   console.error("PostgreSQL pool error:", err);
//   process.exit(1);
// });
//
// module.exports = {
//   query: (text, params) => pool.query(text, params),
//   getClient: () => pool.connect(),
// };

// ── OPCIÓN B: Supabase ───────────────────────────────────────
// const { createClient } = require("@supabase/supabase-js");
//
// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_KEY   // service key, NO la anon key
// );
//
// module.exports = { supabase };

// ── MOCK: En memoria (activo por defecto) ────────────────────
// Simula una DB durante desarrollo sin necesidad de infraestructura.
// Los datos se pierden al reiniciar el servidor.

const { MOCK_CHARACTERS, MOCK_PROGRESS } = require("./seedData");

const db = {
  characters: [...MOCK_CHARACTERS],
  progress:   { ...MOCK_PROGRESS },
};

module.exports = { db };
