// ============================================================
// CharacterForm.jsx — Formulario de creación/edición de personajes
// ============================================================

import { useState } from "react";
import {
  CLASS_COLORS, OWNERS, FACTIONS, CLASSES,
  PROFESIONES_PRIMARIAS, PROFESIONES_SECUNDARIAS, PROFESION_COLORS,
} from "../utils/constants.js";

const inputStyle = {
  width: "100%", background: "#1a1a2e", border: "1px solid #2a2a4a",
  borderRadius: 6, color: "#e0e0e0", padding: "8px 10px",
  fontSize: 13, outline: "none", boxSizing: "border-box",
};

const labelStyle = {
  color: "#888", fontSize: 11, fontWeight: 600, letterSpacing: 1,
  textTransform: "uppercase", display: "block", marginBottom: 4,
};

const sectionLabel = (text) => (
  <div style={{ color: "#c4a832", fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
    textTransform: "uppercase", marginBottom: 6, marginTop: 14 }}>
    {text}
  </div>
);

const DEFAULT_CHARACTER = {
  owner: "Cristian", name: "", level: 80, itemLevel: 0,
  faction: "Alliance", realm: "Ragnaros", class: "Mage",
  spec: "", professions: [],
};

export function CharacterForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ?? DEFAULT_CHARACTER);

  const handleField = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === "number" ? Number(e.target.value) : e.target.value,
    }));

  // ── Lógica de profesiones ──────────────────────────────────
  const primarias   = form.professions?.filter(p => PROFESIONES_PRIMARIAS.includes(p))  ?? [];
  const secundarias = form.professions?.filter(p => PROFESIONES_SECUNDARIAS.includes(p)) ?? [];

  const toggleProfesion = (prof, tipo) => {
    const current = form.professions ?? [];
    if (current.includes(prof)) {
      // Desmarcar siempre está permitido
      setForm(f => ({ ...f, professions: current.filter(p => p !== prof) }));
    } else {
      // Primaria: máximo 2
      if (tipo === "primaria" && primarias.length >= 2) return;
      // Secundaria: sin límite (son 3 y se pueden tener todas)
      setForm(f => ({ ...f, professions: [...current, prof] }));
    }
  };

  const ProfButton = ({ prof, tipo }) => {
    const active  = (form.professions ?? []).includes(prof);
    const color   = PROFESION_COLORS[prof] ?? "#888";
    const maxed   = tipo === "primaria" && primarias.length >= 2 && !active;
    return (
      <button
        onClick={() => toggleProfesion(prof, tipo)}
        disabled={maxed}
        style={{
          padding: "4px 12px", borderRadius: 20, fontSize: 11, cursor: maxed ? "not-allowed" : "pointer",
          background: active ? `${color}22` : "#1a1a2e",
          color:      active ? color        : maxed ? "#333" : "#666",
          border:     `1px solid ${active ? `${color}66` : "#2a2a4a"}`,
          transition: "all 0.15s", opacity: maxed ? 0.4 : 1,
        }}
      >
        {prof}
      </button>
    );
  };

  const handleSave = () => onSave({ ...form });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {/* Campos texto/número */}
      {[
        ["Nombre",      "name",      "text"],
        ["Reino",       "realm",     "text"],
        ["Nivel",       "level",     "number"],
        ["Nivel de objeto", "itemLevel", "number"],
      ].map(([label, key, type]) => (
        <div key={key}>
          <label style={labelStyle}>{label}</label>
          <input type={type} value={form[key]} onChange={handleField(key)} style={inputStyle} />
        </div>
      ))}

      {/* Selects */}
      {[
        ["Jugador",  "owner",   OWNERS],
        ["Facción",  "faction", FACTIONS],
        ["Clase",    "class",   CLASSES],
      ].map(([label, key, opts]) => (
        <div key={key}>
          <label style={labelStyle}>{label}</label>
          <select value={form[key]} onChange={handleField(key)}
            style={{ ...inputStyle, cursor: "pointer" }}>
            {opts.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      ))}

      {/* Especialización */}
      <div>
        <label style={labelStyle}>Especialización</label>
        <input value={form.spec} onChange={handleField("spec")}
          style={inputStyle} placeholder="Ej: Escarcha" />
      </div>

      {/* Profesiones primarias */}
      <div style={{ gridColumn: "span 2" }}>
        {sectionLabel(`Profesiones primarias (${primarias.length}/2)`)}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {PROFESIONES_PRIMARIAS.map(p => <ProfButton key={p} prof={p} tipo="primaria" />)}
        </div>
      </div>

      {/* Profesiones secundarias */}
      <div style={{ gridColumn: "span 2" }}>
        {sectionLabel(`Profesiones secundarias (${secundarias.length}/3)`)}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {PROFESIONES_SECUNDARIAS.map(p => <ProfButton key={p} prof={p} tipo="secundaria" />)}
        </div>
      </div>

      {/* Acciones */}
      <div style={{ gridColumn: "span 2", display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button onClick={onCancel}
          style={{ padding: "8px 18px", borderRadius: 6, background: "transparent", border: "1px solid #3a3a5a", color: "#aaa", cursor: "pointer", fontSize: 13 }}>
          Cancelar
        </button>
        <button onClick={handleSave}
          style={{ padding: "8px 18px", borderRadius: 6, background: "linear-gradient(135deg,#c4a832,#a07828)", border: "none", color: "#0f0f1a", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
          Guardar
        </button>
      </div>
    </div>
  );
}
