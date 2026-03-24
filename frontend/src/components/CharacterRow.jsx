// ============================================================
// CharacterRow.jsx — Fila del dashboard con múltiples raids
// ============================================================

import { CLASS_COLORS, RAID_LIST, FACTION_ICONS, PROFESION_COLORS } from "../utils/constants.js";
import { calculateProgressScore, createEmptyRaidProgress } from "../utils/progressUtils.js";
import { StatusDot, ProgressBar } from "./ui.jsx";

/** Verde nivel 90, amarillo 45-89, rojo <45 */
function getLevelColor(level) {
  if (level >= 90) return "#4ade80";
  if (level >= 45) return "#facc15";
  return "#ef4444";
}

function RaidCell({ raidProgress, raid }) {
  const rp        = raidProgress ?? createEmptyRaidProgress();
  const normalPct = (rp.normal?.length ?? 0) / raid.bosses.length;
  const heroicPct = (rp.heroic?.length ?? 0) / raid.bosses.length;

  return (
    <td style={{ padding: "8px 6px", textAlign: "center", minWidth: 72 }}>
      <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 2 }}>
        <span title="LFR"    style={{ fontSize: 9, color: rp.lfr    ? "#60a5fa" : "#2a2a4a", fontWeight: 700 }}>L</span>
        <span title="Mythic" style={{ fontSize: 9, color: rp.mythic ? "#ef4444" : "#2a2a4a", fontWeight: 700 }}>M</span>
      </div>
      <div style={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 2 }}>
        <StatusDot done={normalPct >= 1} partial={normalPct > 0 && normalPct < 1} />
        <span style={{ color: "#444", fontSize: 9 }}>N</span>
        <StatusDot done={heroicPct >= 1} partial={heroicPct > 0 && heroicPct < 1} />
        <span style={{ color: "#444", fontSize: 9 }}>H</span>
      </div>
      <div style={{ color: "#444", fontSize: 8 }}>
        {rp.normal?.length ?? 0}/{raid.bosses.length}
      </div>
    </td>
  );
}

export function CharacterRow({ char, progress, onEditProgress, onEditChar, onDelete }) {
  const score      = calculateProgressScore(progress);
  const classColor = CLASS_COLORS[char.class] ?? "#aaa";
  const levelColor = getLevelColor(char.level);
  const factionIcon = FACTION_ICONS[char.faction];

  return (
    <tr style={{ borderBottom: "1px solid #1a1a2e" }}>
      {/* Personaje */}
      <td style={{ padding: "10px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Barra de clase */}
          <div style={{ width: 3, height: 36, borderRadius: 2, background: classColor, flexShrink: 0 }} />
          {/* Icono de facción */}
          {factionIcon && (
            <img
              src={factionIcon}
              alt={char.faction}
              title={char.faction}
              style={{ width: 16, height: 16, imageRendering: "pixelated", flexShrink: 0 }}
            />
          )}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>
              <span style={{ color: classColor }}>{char.name}</span>
              <span style={{ color: "#3a3a5a", fontWeight: 400, fontSize: 11, marginLeft: 4 }}>
                ({char.realm})
              </span>
            </div>
            <div style={{ color: "#555", fontSize: 10 }}>
              {char.class}{char.spec ? ` · ${char.spec}` : ""}
            </div>
            {/* Badges de profesiones */}
            {char.professions?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 3 }}>
                {char.professions.map((prof) => {
                  const color = PROFESION_COLORS[prof] ?? "#666";
                  return (
                    <span key={prof} style={{
                      fontSize: 9, padding: "1px 5px", borderRadius: 10,
                      background: `${color}18`, color, border: `1px solid ${color}44`,
                      whiteSpace: "nowrap",
                    }}>
                      {prof}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Owner */}
      <td style={{ padding: "10px 8px" }}>
        <span style={{
          color: char.owner === "Cristian" ? "#60a5fa" : "#f472b6",
          fontSize: 12, fontWeight: 600,
        }}>
          {char.owner}
        </span>
      </td>

      {/* Nivel */}
      <td style={{ padding: "10px 8px", textAlign: "center" }}>
        <span style={{ color: levelColor, fontSize: 13, fontWeight: 700, textShadow: `0 0 8px ${levelColor}55` }}>
          {char.level}
        </span>
      </td>

      {/* iLvl */}
      <td style={{ padding: "10px 8px", color: char.itemLevel > 0 ? "#facc15" : "#3a3a5a", fontSize: 13, fontWeight: 700 }}>
        {char.itemLevel > 0 ? char.itemLevel : "—"}
      </td>

      {/* Abismos */}
      <td style={{ padding: "10px 8px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              width: 12, height: 12, borderRadius: 2,
              background: i <= (progress?.abismos ?? 0) ? "#60a5fa" : "#1a1a2e",
              border: "1px solid #2a2a4a",
            }} />
          ))}
        </div>
        <div style={{ color: "#555", fontSize: 9, marginTop: 2 }}>
          {progress?.abismos ?? 0}/4
        </div>
      </td>

      {/* Una columna por raid */}
      {RAID_LIST.map((raid) => (
        <RaidCell
          key={raid.id}
          raid={raid}
          raidProgress={progress?.raids?.[raid.id]}
        />
      ))}

      {/* Hunt */}
      <td style={{ padding: "10px 8px", textAlign: "center" }}>
        <StatusDot done={progress?.hunt} />
      </td>

      {/* Weekly Quest */}
      <td style={{ padding: "10px 8px", textAlign: "center" }}>
        <StatusDot done={progress?.weeklyQuest} />
      </td>

      {/* Progreso */}
      <td style={{ padding: "10px 8px", minWidth: 80 }}>
        <div style={{ fontSize: 10, color: "#888", marginBottom: 3 }}>{score}%</div>
        <ProgressBar value={score} />
      </td>

      {/* Acciones */}
      <td style={{ padding: "10px 8px" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => onEditProgress(char)} title="Editar progreso"
            style={{ background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 4, color: "#60a5fa", cursor: "pointer", fontSize: 11, padding: "3px 8px" }}>⚔</button>
          <button onClick={() => onEditChar(char)} title="Editar personaje"
            style={{ background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 4, color: "#c4a832", cursor: "pointer", fontSize: 11, padding: "3px 8px" }}>✎</button>
          <button onClick={() => onDelete(char.id)} title="Eliminar personaje"
            style={{ background: "#1a1a2e", border: "1px solid #2a2a4a", borderRadius: 4, color: "#ef4444", cursor: "pointer", fontSize: 11, padding: "3px 8px" }}>✕</button>
        </div>
      </td>
    </tr>
  );
}
