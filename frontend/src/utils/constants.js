// ============================================================
// constants.js — Valores globales compartidos por toda la app
// ============================================================

export const MAX_LEVEL = 90;

export const CURRENT_WEEK = (() => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, "0")}`;
})();

// ── Dificultades disponibles (Story Mode excluido — contenido opcional) ──
export const DIFFICULTIES = ["Raid Finder", "Normal", "Heroic", "Mythic"];

// ── Definición completa de raids ─────────────────────────────
export const RAIDS = {
  voidspire: {
    id:            "voidspire",
    name:          "The Voidspire",
    location:      "The Voidstorm",
    requiredLevel: 90,
    lfrMinIlvl:    220,
    difficulties:  ["Raid Finder", "Normal", "Heroic", "Mythic"],
    bosses: [
      "Imperator Averzian",
      "Vorasius",
      "Fallen-King Salhadaar",
      "Vaelgor & Ezzorak",
      "Lightblinded Vanguard",
      "Crown of the Cosmos",
    ],
    availability: {
      "2026-03-17": ["Raid Finder Wing 1", "Normal", "Heroic"],
      "2026-03-24": ["Raid Finder Wing 2", "Mythic"],
      "2026-03-31": ["Raid Finder Wing 3"],
    },
  },

  dreamrift: {
    id:            "dreamrift",
    name:          "The Dreamrift",
    location:      "Harandar",
    requiredLevel: 90,
    lfrMinIlvl:    220,
    difficulties:  ["Raid Finder", "Normal", "Heroic", "Mythic"],
    bosses: [
      "Chimaerus",
    ],
    availability: {
      "2026-03-17": ["Raid Finder", "Normal", "Heroic"],
      "2026-03-24": ["Mythic"],
    },
  },

  quelDanas: {
    id:            "quelDanas",
    name:          "March on Quel'Danas",
    location:      "Isle of Quel'Danas",
    requiredLevel: 90,
    lfrMinIlvl:    220,
    difficulties:  ["Raid Finder", "Normal", "Heroic", "Mythic"],
    bosses: [
      "Belo'ren, Child of Al'ar",
      "Midnight Falls",
    ],
    availability: {
      "2026-03-31": ["Normal", "Heroic", "Mythic"],
      "2026-04-07": ["Raid Finder"],
    },
  },
};

// ── Helpers de acceso rápido ──────────────────────────────────
export const RAID_LIST   = Object.values(RAIDS);
export const ALL_BOSSES  = RAID_LIST.flatMap((r) => r.bosses);

export const CLASS_COLORS = {
  "Mage":         "#69CCF0",
  "Death Knight": "#C41F3B",
  "Hunter":       "#ABD473",
  "Druid":        "#FF7D0A",
  "Paladin":      "#F58CBA",
  "Warrior":      "#C79C6E",
  "Rogue":        "#FFF569",
  "Priest":       "#FFFFFF",
  "Shaman":       "#0070DE",
  "Warlock":      "#9482C9",
  "Monk":         "#00FF96",
  "Demon Hunter": "#A330C9",
  "Evoker":       "#33937F",
};

export const FACTION_COLORS = {
  Alliance: "#60a5fa",
  Horde:    "#ef4444",
};

export const OWNERS = ["Cristian", "Natalia"];
export const FACTIONS = ["Alliance", "Horde"];
export const CLASSES = Object.keys(CLASS_COLORS);

// ── Iconos de facción (base64, 13×15px originales, mostrar a 16×16) ──
export const FACTION_ICONS = {
  Alliance: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAPCAMAAAAI/bVFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjZFMjdFRTU4NkY2MjExRTA4MDM4RjU5NzE1OTk0NzdBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjZFMjdFRTU5NkY2MjExRTA4MDM4RjU5NzE1OTk0NzdBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NkUyN0VFNTY2RjYyMTFFMDgwMzhGNTk3MTU5OTQ3N0EiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NkUyN0VFNTc2RjYyMTFFMDgwMzhGNTk3MTU5OTQ3N0EiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4CPthlAAAApVBMVEUFLFW9dgK4cwIbO1ILNl0rQUlbUStkOAKkagJ7XRmwbwKJYQ5YLQJrVyK5dAKZZgZIIAJxQQIFMFuYZAQ5RTyzcAJLTDVsViCsbQKiaQK7dQJ9XRaIXQqvbAKTWQKhZQK0cAJGJwJkOQKMYAqjZAKrbQK3cQKhZAKHUQJ3WRmfZwIMNlucYgKzcQKYXgKkaAJlOQKfZQKaZgO0bwJDJQKQWwL///8CX8f6AAAAN3RSTlP///////////////////////////////////////////////////////////////////////8AEFmdiwAAAKVJREFUeNokjtdyAkEMBEebb/cywZicc7CN0f9/GgLepks1owYz541n3+SSwHwv/47U6ZTzWmhJlQVgK2oY+cW2mZAzepvjt6udCjapwnQn6KnMJRcLpwpFWEmpSFQltKnEt7GGNjqQtuaGcRYQVD/GNoyu+FFKBklm49CDd2TQFzK0frnsv+QIHKZvs7qn5fuprN/EPmrogf9YMy/Oj9n/KzwFGADZFg+z9VskrAAAAABJRU5ErkJggg==",
  Horde:    "data:image/png;base64,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",
};

// ── Profesiones ───────────────────────────────────────────────
export const PROFESIONES_PRIMARIAS = [
  "Alquimia",
  "Herrería",
  "Encantamiento",
  "Ingeniería",
  "Inscripción",
  "Joyería",
  "Peletería",
  "Sastrería",
];

export const PROFESIONES_SECUNDARIAS = [
  "Cocina",
  "Pesca",
  "Arqueología",
];

export const TODAS_LAS_PROFESIONES = [...PROFESIONES_PRIMARIAS, ...PROFESIONES_SECUNDARIAS];

// Colores por profesión para los badges
export const PROFESION_COLORS = {
  "Alquimia":      "#a78bfa",
  "Herrería":      "#94a3b8",
  "Encantamiento": "#f472b6",
  "Ingeniería":    "#fb923c",
  "Inscripción":   "#67e8f9",
  "Joyería":       "#fbbf24",
  "Peletería":     "#86efac",
  "Sastrería":     "#c084fc",
  "Cocina":        "#f97316",
  "Pesca":         "#38bdf8",
  "Arqueología":   "#d4a574",
};
