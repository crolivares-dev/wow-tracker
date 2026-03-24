// ============================================================
// App.jsx — Componente raíz. Solo orquesta estado y navegación.
// ============================================================

import { useState, useMemo } from "react";

import { useCharacters }  from "./hooks/useCharacters.js";
import { useProgress }    from "./hooks/useProgress.js";
import { CURRENT_WEEK, RAID_LIST } from "./utils/constants.js";
import { calculateProgressScore } from "./utils/progressUtils.js";

import { Modal }          from "./components/Modal.jsx";
import { CharacterForm }  from "./components/CharacterForm.jsx";
import { CharacterRow }   from "./components/CharacterRow.jsx";
import { ProgressEditor } from "./components/ProgressEditor.jsx";
import { MatchingPanel }  from "./components/MatchingPanel.jsx";

export default function App() {
  // ── Estado de navegación ───────────────────────────────────
  const [tab,    setTab]    = useState("dashboard");
  const [modal,  setModal]  = useState(null);  // { type, data? }
  const [filter, setFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState("name");

  // ── Data hooks ─────────────────────────────────────────────
  const {
    characters, loading: loadingChars,
    addCharacter, updateCharacter, deleteCharacter,
  } = useCharacters();

  const {
    progressMap, loading: loadingProgress,
    saveProgress, resetWeek,
  } = useProgress();

  const characterIds = useMemo(() => characters.map((c) => c.id), [characters]);

  // ── Lista filtrada y ordenada ──────────────────────────────
  const filtered = useMemo(() => {
    let list = filter === "Todos"
      ? characters
      : characters.filter((c) => c.owner === filter);

    if      (sortBy === "level")    list = [...list].sort((a, b) => b.level - a.level);
    else if (sortBy === "ilvl")     list = [...list].sort((a, b) => b.itemLevel - a.itemLevel);
    else if (sortBy === "progress") list = [...list].sort((a, b) => calculateProgressScore(progressMap[b.id]) - calculateProgressScore(progressMap[a.id]));
    else                            list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [characters, filter, sortBy, progressMap]);

  // ── Handlers ───────────────────────────────────────────────
  const handleAddChar = async (data) => {
    await addCharacter(data);
    setModal(null);
  };

  const handleEditChar = async (data) => {
    await updateCharacter(data.id, data);
    setModal(null);
  };

  const handleDeleteChar = async (id) => {
    if (!confirm("¿Eliminar personaje?")) return;
    await deleteCharacter(id);
  };

  const handleSaveProgress = async (data) => {
    await saveProgress(data);
    setModal(null);
  };

  const handleResetWeek = async () => {
    if (!confirm("¿Reiniciar progreso de todos los personajes esta semana?")) return;
    await resetWeek(characterIds);
  };

  // ── Estilos reutilizables ──────────────────────────────────
  const thStyle = {
    padding: "8px 12px", color: "#555", fontSize: 10, fontWeight: 700,
    letterSpacing: 1, textTransform: "uppercase", textAlign: "left",
    borderBottom: "1px solid #1a1a2e", whiteSpace: "nowrap",
  };

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setTab(id)}
      style={{
        padding: "8px 20px", borderRadius: 6, border: "none", cursor: "pointer",
        fontSize: 13, fontWeight: 600, transition: "all 0.2s",
        background: tab === id ? "linear-gradient(135deg,#c4a832,#a07828)" : "transparent",
        color: tab === id ? "#0f0f1a" : "#666",
      }}
    >
      {label}
    </button>
  );

  const isLoading = loadingChars || loadingProgress;

  // ── Render ─────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#e0e0e0", fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ background: "linear-gradient(180deg,#0d0d20 0%,#080810 100%)", borderBottom: "1px solid #1a1a3a", padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 20, height: 56 }}>
          <div>
            <span style={{ fontFamily: "'Cinzel', serif", color: "#c4a832", fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>⚔ WoW</span>
            <span style={{ fontFamily: "'Cinzel', serif", color: "#6a6a8a", fontSize: 14, letterSpacing: 1, marginLeft: 6 }}>Midnight Tracker</span>
          </div>
          <div style={{ display: "flex", gap: 4, marginLeft: 16 }}>
            <TabButton id="dashboard" label="Dashboard" />
            <TabButton id="matching"  label="Matching"  />
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button
              onClick={handleResetWeek}
              style={{ padding: "6px 14px", borderRadius: 6, background: "transparent", border: "1px solid #3a3a5a", color: "#888", cursor: "pointer", fontSize: 12 }}
            >
              🔄 Reset Semana
            </button>
            <button
              onClick={() => setModal({ type: "addChar" })}
              style={{ padding: "6px 14px", borderRadius: 6, background: "linear-gradient(135deg,#c4a832,#a07828)", border: "none", color: "#0f0f1a", fontWeight: 700, cursor: "pointer", fontSize: 12 }}
            >
              + Personaje
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px" }}>
        {isLoading && (
          <div style={{ color: "#555", textAlign: "center", padding: 40 }}>Cargando...</div>
        )}

        {!isLoading && tab === "dashboard" && (
          <>
            {/* Filtros */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 4, background: "#0d0d1a", borderRadius: 8, padding: 4, border: "1px solid #1a1a3a" }}>
                {["Todos", "Cristian", "Natalia"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "4px 14px", borderRadius: 5, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                      background: filter === f ? (f === "Cristian" ? "#60a5fa22" : f === "Natalia" ? "#f472b622" : "#1a1a2e") : "transparent",
                      color: filter === f ? (f === "Cristian" ? "#60a5fa" : f === "Natalia" ? "#f472b6" : "#e0e0e0") : "#555",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 4, alignItems: "center", marginLeft: 8 }}>
                <span style={{ color: "#555", fontSize: 11 }}>Ordenar:</span>
                {[["name", "Nombre"], ["level", "Nivel"], ["ilvl", "Item Level"], ["progress", "Progreso"]].map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => setSortBy(v)}
                    style={{
                      padding: "4px 10px", borderRadius: 5, cursor: "pointer", fontSize: 11,
                      border: `1px solid ${sortBy === v ? "#c4a83244" : "#1a1a3a"}`,
                      background: sortBy === v ? "#c4a83211" : "transparent",
                      color: sortBy === v ? "#c4a832" : "#555",
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div style={{ marginLeft: "auto", color: "#555", fontSize: 11 }}>
                {filtered.length} personajes · Semana {CURRENT_WEEK}
              </div>
            </div>

            {/* Tabla */}
            <div style={{ background: "#0a0a18", border: "1px solid #1a1a3a", borderRadius: 10, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#0d0d20" }}>
                    <th style={{ ...thStyle, minWidth: 160 }}>Personaje</th>
                    <th style={thStyle}>Jugador</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Nivel</th>
                    <th style={thStyle}>iLvl</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Abismos</th>
                    {RAID_LIST.map((raid) => (
                      <th key={raid.id} style={{ ...thStyle, textAlign: "center", minWidth: 72 }}>
                        {raid.name.replace("The ", "").replace("March on ", "")}
                      </th>
                    ))}
                    <th style={{ ...thStyle, textAlign: "center" }}>Cacería</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Misión</th>
                    <th style={{ ...thStyle, minWidth: 90 }}>Progreso</th>
                    <th style={thStyle}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((char) => (
                    <CharacterRow
                      key={char.id}
                      char={char}
                      progress={progressMap[char.id]}
                      onEditProgress={(c) => setModal({ type: "editProgress", data: c })}
                      onEditChar={(c)     => setModal({ type: "editChar",     data: c })}
                      onDelete={handleDeleteChar}
                    />
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div style={{ color: "#555", textAlign: "center", padding: 48, fontSize: 14 }}>
                  No hay personajes.{" "}
                  <button
                    onClick={() => setModal({ type: "addChar" })}
                    style={{ color: "#c4a832", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                  >
                    Agregar uno
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {!isLoading && tab === "matching" && (
          <MatchingPanel characters={characters} progressMap={progressMap} />
        )}
      </div>

      {/* Leyenda */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 24px" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {[["#ef4444", "No iniciado"], ["#facc15", "Parcial"], ["#4ade80", "Completado"]].map(([color, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />
              <span style={{ color: "#555", fontSize: 11 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modales */}
      {modal?.type === "addChar" && (
        <Modal title="Agregar Personaje" onClose={() => setModal(null)}>
          <CharacterForm onSave={handleAddChar} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "editChar" && (
        <Modal title="Editar Personaje" onClose={() => setModal(null)}>
          <CharacterForm initial={modal.data} onSave={handleEditChar} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "editProgress" && (
        <Modal title={`Progreso — ${modal.data.name}`} onClose={() => setModal(null)}>
          <ProgressEditor
            char={modal.data}
            progress={progressMap[modal.data.id]}
            onSave={handleSaveProgress}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
