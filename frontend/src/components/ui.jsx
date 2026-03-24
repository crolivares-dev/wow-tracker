// ============================================================
// ui.jsx — Componentes de UI reutilizables y sin estado
// ============================================================

/**
 * Punto de color que indica estado: completado / parcial / pendiente.
 */
export function StatusDot({ done, partial }) {
  const color = done ? "#4ade80" : partial ? "#facc15" : "#ef4444";
  return (
    <span style={{
      display: "inline-block", width: 10, height: 10, borderRadius: "50%",
      background: color, boxShadow: `0 0 6px ${color}`,
    }} />
  );
}

/**
 * Barra de progreso horizontal con color dinámico según el porcentaje.
 */
export function ProgressBar({ value, max = 100 }) {
  const pct   = Math.min(100, (value / max) * 100);
  const color = pct >= 80 ? "#4ade80" : pct >= 40 ? "#facc15" : "#ef4444";
  return (
    <div style={{ height: 4, background: "#2a2a3a", borderRadius: 2, overflow: "hidden", width: "100%" }}>
      <div style={{
        height: "100%", width: `${pct}%`, background: color,
        borderRadius: 2, transition: "width 0.4s ease",
      }} />
    </div>
  );
}

/**
 * Toggle switch estilizado (sin HTML checkbox).
 */
export function Toggle({ value, onChange, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {label && <span style={{ color: "#888", fontSize: 12 }}>{label}</span>}
      <div
        onClick={() => onChange(!value)}
        style={{
          width: 36, height: 20, borderRadius: 10, cursor: "pointer",
          position: "relative", flexShrink: 0,
          background: value ? "#4ade8044" : "#1a1a2e",
          border: `1px solid ${value ? "#4ade8088" : "#2a2a4a"}`,
          transition: "all 0.25s",
        }}
      >
        <div style={{
          position: "absolute", top: 2, left: value ? 18 : 2,
          width: 14, height: 14, borderRadius: "50%",
          background: value ? "#4ade80" : "#555",
          transition: "left 0.25s, background 0.25s",
          boxShadow: value ? "0 0 6px #4ade8088" : "none",
        }} />
      </div>
    </div>
  );
}
