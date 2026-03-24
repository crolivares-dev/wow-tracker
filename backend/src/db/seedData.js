// ============================================================
// db/seedData.js
// Datos iniciales para el mock en memoria del backend.
// Cuando la DB real esté lista, este archivo se usa solo
// para poblar la DB en el primer deploy (seed script).
// ============================================================

const MOCK_CHARACTERS = [
  // ── NATALIA ──────────────────────────────────────────────────
  { id: "n01", owner: "Natalia", name: "Lawrenn",      level: 90, itemLevel: 0, faction: "Alliance", realm: "Ragnaros",    class: "Paladin",      spec: "", professions: [] },
  { id: "n02", owner: "Natalia", name: "Lilawen",      level: 80, itemLevel: 0, faction: "Alliance", realm: "Ragnaros",    class: "Paladin",      spec: "", professions: [] },
  { id: "n03", owner: "Natalia", name: "Cryssae",      level: 80, itemLevel: 0, faction: "Horde",    realm: "Ragnaros",    class: "Paladin",      spec: "", professions: [] },
  { id: "n04", owner: "Natalia", name: "Lawrenette",   level: 80, itemLevel: 0, faction: "Alliance", realm: "Quel'Thalas", class: "Paladin",      spec: "", professions: [] },
  { id: "n05", owner: "Natalia", name: "Hortenzia",    level: 80, itemLevel: 0, faction: "Alliance", realm: "Ragnaros",    class: "Mage",         spec: "", professions: [] },
  { id: "n06", owner: "Natalia", name: "Natunocturna", level: 90, itemLevel: 0, faction: "Horde",    realm: "Ragnaros",    class: "Mage",         spec: "", professions: [] },
  { id: "n07", owner: "Natalia", name: "Lawridari",    level: 80, itemLevel: 0, faction: "Alliance", realm: "Ragnaros",    class: "Demon Hunter", spec: "", professions: [] },
  { id: "n08", owner: "Natalia", name: "Moccamint",    level: 80, itemLevel: 0, faction: "Horde",    realm: "Ragnaros",    class: "Demon Hunter", spec: "", professions: [] },
  { id: "n09", owner: "Natalia", name: "Lawren",       level: 80, itemLevel: 0, faction: "Horde",    realm: "Ragnaros",    class: "Warlock",      spec: "", professions: [] },
  { id: "n10", owner: "Natalia", name: "Lawrissa",     level: 80, itemLevel: 0, faction: "Alliance", realm: "Quel'Thalas", class: "Warlock",      spec: "", professions: [] },
  { id: "n11", owner: "Natalia", name: "Moonberry",    level: 90, itemLevel: 0, faction: "Horde",    realm: "Ragnaros",    class: "Druid",        spec: "", professions: [] },
  { id: "n12", owner: "Natalia", name: "Nuni",         level: 80, itemLevel: 0, faction: "Horde",    realm: "Drakkari",    class: "Druid",        spec: "", professions: [] },
  { id: "n13", owner: "Natalia", name: "Pawmi",        level: 80, itemLevel: 0, faction: "Horde",    realm: "Ragnaros",    class: "Hunter",       spec: "", professions: [] },
  { id: "n14", owner: "Natalia", name: "Faelune",      level: 90, itemLevel: 0, faction: "Horde",    realm: "Drakkari",    class: "Hunter",       spec: "", professions: [] },
  { id: "n15", owner: "Natalia", name: "Sanyra",       level: 80, itemLevel: 0, faction: "Horde",    realm: "Ragnaros",    class: "Evoker",       spec: "", professions: [] },
  { id: "n16", owner: "Natalia", name: "Roswynn",      level: 80, itemLevel: 0, faction: "Alliance", realm: "Ragnaros",    class: "Warrior",      spec: "", professions: [] },
  { id: "n17", owner: "Natalia", name: "Lawrisse",     level: 80, itemLevel: 0, faction: "Alliance", realm: "Ragnaros",    class: "Death Knight", spec: "", professions: [] },
  { id: "n18", owner: "Natalia", name: "Rosemilk",     level: 80, itemLevel: 0, faction: "Horde",    realm: "Drakkari",    class: "Death Knight", spec: "", professions: [] },
  { id: "n19", owner: "Natalia", name: "Lawryn",       level: 80, itemLevel: 0, faction: "Alliance", realm: "Ragnaros",    class: "Priest",       spec: "", professions: [] },
  { id: "n20", owner: "Natalia", name: "Amada",        level: 90, itemLevel: 0, faction: "Alliance", realm: "Ragnaros",    class: "Priest",       spec: "", professions: [] },
  { id: "n21", owner: "Natalia", name: "Mochimi",      level: 80, itemLevel: 0, faction: "Alliance", realm: "Quel'Thalas", class: "Monk",         spec: "", professions: [] },
  { id: "n22", owner: "Natalia", name: "Minicake",     level: 80, itemLevel: 0, faction: "Horde",    realm: "Ragnaros",    class: "Rogue",        spec: "", professions: [] },
  { id: "n23", owner: "Natalia", name: "Honeyplum",    level: 80, itemLevel: 0, faction: "Horde",    realm: "Drakkari",    class: "Shaman",       spec: "", professions: [] },
  // ── CRISTIAN ─────────────────────────────────────────────────
  { id: "c01", owner: "Cristian", name: "Ahksagi",     level: 90, itemLevel: 0, faction: "Horde",    realm: "Ragnaros",    class: "Paladin",      spec: "", professions: [] },
  { id: "c02", owner: "Cristian", name: "Ahktheris",   level: 90, itemLevel: 0, faction: "Alliance", realm: "Ragnaros",    class: "Death Knight", spec: "", professions: [] },
  { id: "c03", owner: "Cristian", name: "Slachten",    level: 90, itemLevel: 0, faction: "Horde",    realm: "Ragnaros",    class: "Warrior",      spec: "", professions: [] },
  { id: "c04", owner: "Cristian", name: "Skytta",      level: 90, itemLevel: 0, faction: "Alliance", realm: "Ragnaros",    class: "Hunter",       spec: "", professions: [] },
  { id: "c05", owner: "Cristian", name: "Ahkdreill",   level: 90, itemLevel: 0, faction: "Alliance", realm: "Ragnaros",    class: "Druid",        spec: "", professions: [] },
  { id: "c06", owner: "Cristian", name: "Ahktherin",   level: 80, itemLevel: 0, faction: "Alliance", realm: "Ragnaros",    class: "Mage",         spec: "", professions: [] },
  { id: "c07", owner: "Cristian", name: "Hokule",      level: 80, itemLevel: 0, faction: "Horde",    realm: "Ragnaros",    class: "Druid",        spec: "", professions: [] },
  { id: "c08", owner: "Cristian", name: "Daojiu",      level: 80, itemLevel: 0, faction: "Horde",    realm: "Quel'Thalas", class: "Monk",         spec: "", professions: [] },
  { id: "c09", owner: "Cristian", name: "Brungrum",    level: 80, itemLevel: 0, faction: "Alliance", realm: "Ragnaros",    class: "Warrior",      spec: "", professions: [] },
  { id: "c10", owner: "Cristian", name: "Ahkeran",     level: 80, itemLevel: 0, faction: "Alliance", realm: "Ragnaros",    class: "Warlock",      spec: "", professions: [] },
  { id: "c11", owner: "Cristian", name: "Ahkthannial", level: 80, itemLevel: 0, faction: "Alliance", realm: "Ragnaros",    class: "Priest",       spec: "", professions: [] },
  { id: "c12", owner: "Cristian", name: "Ahktyr",      level: 80, itemLevel: 0, faction: "Alliance", realm: "Ragnaros",    class: "Evoker",       spec: "", professions: [] },
  { id: "c13", owner: "Cristian", name: "Kradets",     level: 76, itemLevel: 0, faction: "Alliance", realm: "Ragnaros",    class: "Rogue",        spec: "", professions: [] },
  { id: "c14", owner: "Cristian", name: "Rodakti",     level: 70, itemLevel: 0, faction: "Horde",    realm: "Ragnaros",    class: "Shaman",       spec: "", professions: [] },
  { id: "c15", owner: "Cristian", name: "Ahkdreill",   level:  5, itemLevel: 0, faction: "Alliance", realm: "Quel'Thalas", class: "Druid",        spec: "", professions: [] },
];

const currentWeek = "2026-W12";

const MOCK_PROGRESS = Object.fromEntries(
  MOCK_CHARACTERS.map((c, i) => [
    c.id,
    {
      id:          `p${i + 1}`,
      characterId: c.id,
      weekId:      currentWeek,
      abismos:     0,
      hunt:        false,
      weeklyQuest: false,
      knowledge:   0,
      raids: {
        voidspire: { lfr: false, normal: [], heroic: [], mythic: false },
        dreamrift:  { lfr: false, normal: [], heroic: [], mythic: false },
        quelDanas:  { lfr: false, normal: [], heroic: [], mythic: false },
      },
    },
  ])
);

module.exports = { MOCK_CHARACTERS, MOCK_PROGRESS, currentWeek };
