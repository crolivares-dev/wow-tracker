// ============================================================
// ProgressEditor.jsx — Editor de progreso semanal
// Soporta 3 raids × 5 dificultades (Story, LFR, Normal, Heroic, Mythic)
// ============================================================

import { useState } from "react";
import { RAIDS, RAID_LIST, CURRENT_WEEK } from "../utils/constants.js";
import { createEmptyProgress, createEmptyRaidProgress } from "../utils/progressUtils.js";

// ── Estilos base ─────────────────────────────────────────────
const sectionTitle = (text) => (
  <div style={{
    color: "#c4a832", fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
    textTransform: "uppercase", marginBottom: 8, marginTop: 16,
  }}>
    {text}
  </div>
);

const checkboxStyle = (active) => ({
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  width: 18, height: 18, borderRadius: 4,
  border: `2px solid ${active ? "#4ade80" : "#3a3a5a"}`,
  background: active ? "#4ade8022" : "transparent",
  cursor: "pointer", flexShrink: 0,
});

const Checkmark = () => (
  <svg width="10" height="10" viewBox="0 0 12 12">
    <polyline points="1,6 4,10 11,2" fill="none" stroke="#4ade80"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Componente boss toggle ────────────────────────────────────
function BossButton({ boss, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: "3px 10px", borderRadius: 20, fontSize: 11, cursor: "pointer",
      background: active ? "#4ade8033" : "#1a1a2e",
      color:      active ? "#4ade80"   : "#666",
      border:     `1px solid ${active ? "#4ade8066" : "#2a2a4a"}`,
      transition: "all 0.2s",
    }}>
      {boss}
    </button>
  );
}

// ── Panel de una raid ─────────────────────────────────────────
function RaidPanel({ raid, raidProgress, onChange }) {
  const rp = raidProgress ?? createEmptyRaidProgress();

  const toggleBool = (key) =>
    onChange({ ...rp, [key]: !rp[key] });

  const toggleBoss = (diff, boss) => {
    const arr = rp[diff] ?? [];
    onChange({
      ...rp,
      [diff]: arr.includes(boss) ? arr.filter((b) => b !== boss) : [...arr, boss],
    });
  };

  const diffColor = {
    story:  "#a78bfa",
    lfr:    "#60a5fa",
    heroic: "#f59e0b",
    mythic: "#ef4444",
  };

  return (
    <div style={{
      background: "#0a0a16", border: "1px solid #1e1e3a",
      borderRadius: 10, padding: 14, marginBottom: 12,
    }}>
      {/* Header de la raid */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
        <span style={{ color: "#c4a832", fontWeight: 700, fontSize: 13 }}>{raid.name}</span>
        <span style={{ color: "#3a3a5a", fontSize: 11 }}>{raid.location}</span>
        <span style={{ color: "#555", fontSize: 10, marginLeft: "auto" }}>
          {raid.bosses.length} {raid.bosses.length === 1 ? "boss" : "bosses"}
        </span>
      </div>

      {/* LFR y Mythic (boolean) */}
      <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
        {[
          ["lfr",    "LFR",    diffColor.lfr],
          ["mythic", "Mythic", diffColor.mythic],
        ].map(([key, label, color]) => (
          <div
            key={key}
            onClick={() => toggleBool(key)}
            style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
          >
            <div style={checkboxStyle(rp[key])}>
              {rp[key] && <Checkmark />}
            </div>
            <span style={{ color: rp[key] ? color : "#555", fontSize: 12, fontWeight: 600 }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Normal — bosses */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ color: "#4ade80", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
          Normal — {rp.normal?.length ?? 0}/{raid.bosses.length}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {raid.bosses.map((boss) => (
            <BossButton
              key={boss} boss={boss}
              active={(rp.normal ?? []).includes(boss)}
              onClick={() => toggleBoss("normal", boss)}
            />
          ))}
        </div>
      </div>

      {/* Heroic — bosses */}
      <div>
        <div style={{ color: diffColor.heroic, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
          Heroico — {rp.heroic?.length ?? 0}/{raid.bosses.length}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {raid.bosses.map((boss) => (
            <BossButton
              key={boss} boss={boss}
              active={(rp.heroic ?? []).includes(boss)}
              onClick={() => toggleBoss("heroic", boss)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────
export function ProgressEditor({ char, progress, onSave, onCancel }) {
  const [p, setP] = useState(
    progress ?? createEmptyProgress(char.id, CURRENT_WEEK)
  );

  const setRaidProgress = (raidId, raidProgress) =>
    setP((prev) => ({
      ...prev,
      raids: { ...prev.raids, [raidId]: raidProgress },
    }));

  const toggleBool = (key) =>
    setP((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      {/* Abismos + Knowledge */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          {sectionTitle("Abismos")}
          <div style={{ display: "flex", gap: 6 }}>
            {[0, 1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setP((prev) => ({ ...prev, abismos: n }))}
                style={{
                  width: 36, height: 36, borderRadius: 6, cursor: "pointer",
                  fontSize: 13, fontWeight: 700,
                  border:     `2px solid ${p.abismos >= n && n > 0 ? "#60a5fa" : "#2a2a4a"}`,
                  background: p.abismos >= n && n > 0 ? "#60a5fa22" : "#1a1a2e",
                  color:      p.abismos >= n && n > 0 ? "#60a5fa"   : "#555",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          {sectionTitle("Knowledge")}
          <input
            type="number" min={0} max={30} value={p.knowledge}
            onChange={(e) => setP((prev) => ({ ...prev, knowledge: Number(e.target.value) }))}
            style={{
              width: 80, background: "#1a1a2e", border: "1px solid #2a2a4a",
              borderRadius: 6, color: "#e0e0e0", padding: "8px 10px", fontSize: 14,
            }}
          />
        </div>
      </div>

      {/* Actividades generales */}
      {sectionTitle("Actividades")}
      <div style={{ display: "flex", gap: 20, marginBottom: 4 }}>
        {[["hunt", "Cacería"], ["weeklyQuest", "Misión semanal"]].map(([key, label]) => (
          <div key={key} onClick={() => toggleBool(key)}
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <div style={checkboxStyle(p[key])}>
              {p[key] && <Checkmark />}
            </div>
            <span style={{ color: "#ccc", fontSize: 13 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Raids */}
      {sectionTitle("Raids")}
      {RAID_LIST.map((raid) => (
        <RaidPanel
          key={raid.id}
          raid={raid}
          raidProgress={p.raids?.[raid.id]}
          onChange={(rp) => setRaidProgress(raid.id, rp)}
        />
      ))}

      {/* Acciones */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
        <button onClick={onCancel}
          style={{ padding: "8px 18px", borderRadius: 6, background: "transparent", border: "1px solid #3a3a5a", color: "#aaa", cursor: "pointer", fontSize: 13 }}>
          Cancelar
        </button>
        <button onClick={() => onSave(p)}
          style={{ padding: "8px 18px", borderRadius: 6, background: "linear-gradient(135deg,#c4a832,#a07828)", border: "none", color: "#0f0f1a", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
          Guardar
        </button>
      </div>
    </div>
  );
}
