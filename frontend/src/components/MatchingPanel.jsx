// ============================================================
// MatchingPanel.jsx — Panel de matching entre personajes
// ============================================================

import { useState } from "react";
import { CLASS_COLORS, FACTION_COLORS, MAX_LEVEL } from "../utils/constants.js";
import { buildMatchingPairs } from "../utils/progressUtils.js";
import { Toggle } from "./ui.jsx";

const ACTIVITY_COLORS = {
  "Abismos":      "#60a5fa",
  "LFR":          "#a78bfa",
  "Normal":       "#4ade80",
  "Heroico":      "#f59e0b",
  "Cacería":        "#f472b6",
  "Misión semanal": "#34d399",
};

/**
 * @param {{ characters: object[], progressMap: object }} props
 */
export function MatchingPanel({ characters, progressMap }) {
  const [sameFaction, setSameFaction] = useState(true);

  const eligibles = characters.filter((c) => c.level >= MAX_LEVEL);
  const cristians = eligibles.filter((c) => c.owner === "Cristian");
  const natalias  = eligibles.filter((c) => c.owner === "Natalia");

  const pairs = buildMatchingPairs(characters, progressMap, sameFaction);

  return (
    <div>
      {/* Barra de controles */}
      <div style={{
        display: "flex", alignItems: "center", gap: 20, marginBottom: 16,
        padding: "10px 14px", background: "#0d0d1a",
        border: "1px solid #1a1a3a", borderRadius: 8,
      }}>
        <div style={{ color: "#555", fontSize: 12 }}>
          Solo nivel{" "}
          <span style={{ color: "#4ade80", fontWeight: 700 }}>{MAX_LEVEL}</span>
          {" "}· {cristians.length} de Cristian · {natalias.length} de Natalia
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          <Toggle value={sameFaction} onChange={setSameFaction} label="Misma facción" />
          {!sameFaction && (
            <span style={{
              color: "#f59e0b", fontSize: 10, fontWeight: 600,
              background: "#f59e0b11", border: "1px solid #f59e0b33",
              borderRadius: 20, padding: "1px 8px",
            }}>
              Interfacción
            </span>
          )}
        </div>
      </div>

      {/* Lista de pares */}
      {pairs.length === 0 ? (
        <div style={{ color: "#555", textAlign: "center", padding: 40, fontSize: 14 }}>
          {cristians.length === 0 || natalias.length === 0
            ? `No hay personajes nivel ${MAX_LEVEL} suficientes para hacer matching.`
            : "No hay combinaciones disponibles esta semana 🎉"}
        </div>
      ) : (
        pairs.map((pair, i) => (
          <MatchPairCard key={i} pair={pair} />
        ))
      )}
    </div>
  );
}

/** Tarjeta de un par de personajes con sus actividades compartidas */
function MatchPairCard({ pair }) {
  return (
    <div style={{
      background: "#0d0d1a", border: "1px solid #1e1e3a",
      borderRadius: 10, padding: 16, marginBottom: 12,
    }}>
      {/* Encabezado del par */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <CharacterBadge char={pair.c} />
        <span style={{ color: "#c4a832", fontSize: 16 }}>⚔</span>
        <CharacterBadge char={pair.n} />
        <span style={{
          marginLeft: "auto",
          background: "#c4a83222", border: "1px solid #c4a83244",
          borderRadius: 20, padding: "2px 10px",
          color: "#c4a832", fontSize: 11, fontWeight: 700,
        }}>
          {pair.shared.length} actividades
        </span>
      </div>

      {/* Actividades compartidas */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {pair.shared.map((activity, j) => (
          <ActivityChip key={j} activity={activity} />
        ))}
      </div>
    </div>
  );
}

function CharacterBadge({ char }) {
  const classColor   = CLASS_COLORS[char.class] ?? "#aaa";
  const factionColor = FACTION_COLORS[char.faction] ?? "#aaa";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ color: classColor, fontWeight: 700, fontSize: 14 }}>{char.name}</span>
      <span style={{ color: "#3a3a5a", fontSize: 10 }}>({char.realm})</span>
      <span style={{
        color: factionColor, fontSize: 9, fontWeight: 700,
        background: `${factionColor}18`,
        border: `1px solid ${factionColor}33`,
        borderRadius: 20, padding: "1px 6px",
      }}>
        {char.faction}
      </span>
    </div>
  );
}

function ActivityChip({ activity }) {
  const color = ACTIVITY_COLORS[activity.type] ?? "#888";
  return (
    <div style={{
      background: `${color}11`, border: `1px solid ${color}33`,
      borderRadius: 6, padding: "4px 10px",
    }}>
      <div style={{ color, fontSize: 11, fontWeight: 700 }}>{activity.type}</div>
      <div style={{ color: "#888", fontSize: 10 }}>{activity.detail}</div>
      {activity.bosses && activity.bosses.length <= 4 && (
        <div style={{ color: "#666", fontSize: 9, marginTop: 2 }}>
          {activity.bosses.join(", ")}
        </div>
      )}
    </div>
  );
}
