// ============================================================
// characterService.js — CRUD de personajes contra Supabase
// ============================================================

import { supabase } from "./supabaseClient.js";

// Supabase guarda item_level con snake_case — mapeamos al camelCase del frontend
function toFrontend(row) {
  return {
    id:          row.id,
    owner:       row.owner,
    name:        row.name,
    level:       row.level,
    itemLevel:   row.item_level,
    faction:     row.faction,
    realm:       row.realm,
    class:       row.class,
    spec:        row.spec ?? "",
    professions: row.professions ?? [],
  };
}

function toDatabase(char) {
  return {
    owner:       char.owner,
    name:        char.name,
    level:       char.level,
    item_level:  char.itemLevel ?? 0,
    faction:     char.faction,
    realm:       char.realm,
    class:       char.class,
    spec:        char.spec ?? "",
    professions: char.professions ?? [],
  };
}

export const characterService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return data.map(toFrontend);
  },

  create: async (charData) => {
    const { data, error } = await supabase
      .from("characters")
      .insert([toDatabase(charData)])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toFrontend(data);
  },

  update: async (id, charData) => {
    const { data, error } = await supabase
      .from("characters")
      .update(toDatabase(charData))
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return toFrontend(data);
  },

  delete: async (id) => {
    const { error } = await supabase
      .from("characters")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  },
};
