// ============================================================
// useProgress.js — Hook de progreso semanal (Supabase)
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { progressService } from "../services/progressService.js";

export function useProgress() {
  const [progressMap, setProgressMap] = useState({});
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await progressService.getAll();
      setProgressMap(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveProgress = useCallback(async (progressData) => {
    const updated = await progressService.upsert(progressData);
    setProgressMap((prev) => ({ ...prev, [updated.characterId]: updated }));
  }, []);

  const resetWeek = useCallback(async (characterIds) => {
    await progressService.resetWeek(characterIds);
    const fresh = await progressService.getAll();
    setProgressMap(fresh);
  }, []);

  return { progressMap, loading, error, saveProgress, resetWeek };
}
