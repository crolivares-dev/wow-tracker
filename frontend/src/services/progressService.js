// ============================================================
// progressService.js — Progreso semanal contra Supabase
// ============================================================

import { supabase } from "./supabaseClient.js";
import { createEmptyProgress } from "../utils/progressUtils.js";
import { CURRENT_WEEK } from "../utils/constants.js";

function toFrontend(row) {
  return {
    id:          row.id,
    characterId: row.character_id,
    weekId:      row.week_id,
    abismos:     row.abismos,
    hunt:        row.hunt,
    weeklyQuest: row.weekly_quest,
    knowledge:   row.knowledge,
    raids:       row.raids ?? {
      voidspire: { lfr: false, normal: [], heroic: [], mythic: false },
      dreamrift:  { lfr: false, normal: [], heroic: [], mythic: false },
      quelDanas:  { lfr: false, normal: [], heroic: [], mythic: false },
    },
  };
}

function toDatabase(p) {
  return {
    character_id: p.characterId,
    week_id:      p.weekId ?? CURRENT_WEEK,
    abismos:      p.abismos ?? 0,
    hunt:         p.hunt ?? false,
    weekly_quest: p.weeklyQuest ?? false,
    knowledge:    p.knowledge ?? 0,
    raids:        p.raids ?? {},
  };
}

export const progressService = {
  /**
   * Devuelve todos los registros de la semana actual
   * como mapa { [characterId]: progressObject }
   */
  getAll: async () => {
    const { data, error } = await supabase
      .from("weekly_progress")
      .select("*")
      .eq("week_id", CURRENT_WEEK);
    if (error) throw new Error(error.message);

    // Convertir array → mapa indexado por characterId
    return Object.fromEntries(data.map((row) => [row.character_id, toFrontend(row)]));
  },

  /**
   * Upsert: crea o actualiza el progreso de un personaje
   */
  upsert: async (progressData) => {
    const { data, error } = await supabase
      .from("weekly_progress")
      .upsert(toDatabase(progressData), {
        onConflict: "character_id,week_id",
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toFrontend(data);
  },

  /**
   * Reinicia el progreso de una lista de personajes para la semana actual
   */
  resetWeek: async (characterIds) => {
    const rows = characterIds.map((id) => ({
      character_id: id,
      week_id:      CURRENT_WEEK,
      abismos:      0,
      hunt:         false,
      weekly_quest: false,
      knowledge:    0,
      raids: {
        voidspire: { lfr: false, normal: [], heroic: [], mythic: false },
        dreamrift:  { lfr: false, normal: [], heroic: [], mythic: false },
        quelDanas:  { lfr: false, normal: [], heroic: [], mythic: false },
      },
    }));

    const { error } = await supabase
      .from("weekly_progress")
      .upsert(rows, { onConflict: "character_id,week_id" });
    if (error) throw new Error(error.message);
  },
};
