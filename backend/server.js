// ============================================================
// server.js — Entry point. Solo arranca el servidor.
// ============================================================

require("dotenv").config();

const app  = require("./src/app");
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\n🟢 WoW Tracker API corriendo en http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health\n`);
});
