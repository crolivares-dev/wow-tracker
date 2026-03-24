// ============================================================
// progressUtils.js — Lógica pura de cálculo y matching
// Sin dependencias de React. Testeable de forma aislada.
// ============================================================

import { RAID_LIST, MAX_LEVEL } from "./constants.js";

// ── Pesos del score por actividad ────────────────────────────
const SCORE_WEIGHTS = {
  abismos:     15,
  hunt:         5,
  weeklyQuest: 10,
  // Por raid (se divide entre cantidad de raids):
  lfr:         10,
  normal:      20,
  heroic:      30,
  mythic:      40,
};

/**
 * Crea el progreso vacío de una raid específica.
 * Story Mode excluido — es contenido opcional, no se trackea.
 */
export function createEmptyRaidProgress() {
  return {
    lfr:    false,
    normal: [],
    heroic: [],
    mythic: false,
  };
}

/**
 * Crea un registro de progreso semanal vacío para un personaje.
 * @param {string} characterId
 * @param {string} weekId
 * @returns {object}
 */
export function createEmptyProgress(characterId, weekId) {
  const raids = {};
  for (const raid of RAID_LIST) {
    raids[raid.id] = createEmptyRaidProgress();
  }
  return {
    characterId,
    weekId,
    abismos:     0,
    hunt:        false,
    weeklyQuest: false,
    knowledge:   0,
    raids,
  };
}

/**
 * Calcula el score de progreso semanal de un personaje (0–100).
 * @param {object|null} progress
 * @returns {number}
 */
export function calculateProgressScore(progress) {
  if (!progress) return 0;

  let score       = 0;
  let maxPossible = 0;

  // Abismos
  score       += (progress.abismos / 4) * SCORE_WEIGHTS.abismos;
  maxPossible += SCORE_WEIGHTS.abismos;

  // Hunt y Weekly Quest
  if (progress.hunt)        score += SCORE_WEIGHTS.hunt;
  if (progress.weeklyQuest) score += SCORE_WEIGHTS.weeklyQuest;
  maxPossible += SCORE_WEIGHTS.hunt + SCORE_WEIGHTS.weeklyQuest;

  // Por cada raid
  const raidCount = RAID_LIST.length;
  for (const raid of RAID_LIST) {
    const rp         = progress.raids?.[raid.id] ?? createEmptyRaidProgress();
    const bossCount  = raid.bosses.length;
    const raidWeight = 1 / raidCount;

    if (rp.lfr)    score += SCORE_WEIGHTS.lfr    * raidWeight;
    if (rp.mythic) score += SCORE_WEIGHTS.mythic * raidWeight;

    score += ((rp.normal?.length ?? 0) / bossCount) * SCORE_WEIGHTS.normal * raidWeight;
    score += ((rp.heroic?.length ?? 0) / bossCount) * SCORE_WEIGHTS.heroic * raidWeight;

    maxPossible += (SCORE_WEIGHTS.lfr + SCORE_WEIGHTS.mythic +
                    SCORE_WEIGHTS.normal + SCORE_WEIGHTS.heroic) * raidWeight;
  }

  return Math.min(100, Math.round((score / maxPossible) * 100));
}

/**
 * Interpolación rojo → verde según el nivel del personaje.
 * @param {number} level
 * @returns {string}
 */
export function getLevelColor(level) {
  const t = Math.max(0, Math.min(1, (level - 1) / (MAX_LEVEL - 1)));
  const r = Math.round(239 - (239 - 74) * t);
  const g = Math.round(68 + (222 - 68) * t);
  const b = Math.round(68 + (128 - 68) * t);
  return `rgb(${r},${g},${b})`;
}

/**
 * Devuelve actividades compartidas entre dos personajes.
 */
export function getSharedActivities(charA, charB, progressA, progressB) {
  const pa     = progressA;
  const pb     = progressB;
  const shared = [];

  // Abismos
  if ((pa?.abismos ?? 0) < 4 && (pb?.abismos ?? 0) < 4) {
    shared.push({
      type:   "Abismos",
      detail: `${charA.name}: ${pa?.abismos ?? 0}/4 · ${charB.name}: ${pb?.abismos ?? 0}/4`,
    });
  }

  // Hunt y Weekly Quest
  if (!pa?.hunt        && !pb?.hunt)        shared.push({ type: "Cacería",       detail: "Ambos pendientes" });
  if (!pa?.weeklyQuest && !pb?.weeklyQuest) shared.push({ type: "Misión semanal", detail: "Ambos pendientes" });

  // Por cada raid
  for (const raid of RAID_LIST) {
    const rpa = pa?.raids?.[raid.id] ?? createEmptyRaidProgress();
    const rpb = pb?.raids?.[raid.id] ?? createEmptyRaidProgress();
    const n   = raid.name;

    if (!rpa.lfr    && !rpb.lfr)    shared.push({ type: `${n} — LFR`,    detail: "Ambos pendientes" });
    if (!rpa.mythic && !rpb.mythic) shared.push({ type: `${n} — Mythic`, detail: "Ambos pendientes" });

    const pendingNormal = raid.bosses.filter(
      (b) => !rpa.normal?.includes(b) && !rpb.normal?.includes(b)
    );
    if (pendingNormal.length > 0) {
      shared.push({
        type:   `${n} — Normal`,
        detail: `${pendingNormal.length} jefes en común`,
        bosses: pendingNormal,
      });
    }

    const pendingHeroic = raid.bosses.filter(
      (b) => !rpa.heroic?.includes(b) && !rpb.heroic?.includes(b)
    );
    if (pendingHeroic.length > 0) {
      shared.push({
        type:   `${n} — Heroico`,
        detail: `${pendingHeroic.length} jefes en común`,
        bosses: pendingHeroic,
      });
    }
  }

  return shared;
}

/**
 * Genera todos los pares de matching válidos.
 */
export function buildMatchingPairs(characters, progressMap, sameFaction = true) {
  const eligibles = characters.filter((c) => c.level >= MAX_LEVEL);
  const cristians = eligibles.filter((c) => c.owner === "Cristian");
  const natalias  = eligibles.filter((c) => c.owner === "Natalia");

  const pairs = [];

  for (const c of cristians) {
    for (const n of natalias) {
      if (sameFaction && c.faction !== n.faction) continue;
      const shared = getSharedActivities(c, n, progressMap[c.id], progressMap[n.id]);
      if (shared.length > 0) pairs.push({ c, n, shared });
    }
  }

  return pairs.sort((a, b) => b.shared.length - a.shared.length);
}
