// ============================================================
// useCharacters.js — Hook de gestión de personajes (Supabase)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { characterService } from "../services/characterService.js";

export function useCharacters() {
  const [characters, setCharacters] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await characterService.getAll();
      setCharacters(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addCharacter = useCallback(async (data) => {
    const created = await characterService.create(data);
    setCharacters((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    return created;
  }, []);

  const updateCharacter = useCallback(async (id, data) => {
    const updated = await characterService.update(id, data);
    setCharacters((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }, []);

  const deleteCharacter = useCallback(async (id) => {
    await characterService.delete(id);
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { characters, loading, error, addCharacter, updateCharacter, deleteCharacter, refresh: load };
}
