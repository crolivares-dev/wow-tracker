# ⚔ WoW Midnight Tracker

Tracker de progreso semanal para personajes de World of Warcraft.  
Gestiona personajes, registra progreso semanal y genera matching automático entre jugadores.

---

## Estructura del proyecto

```
wow-tracker/
│
├── frontend/                        # React + Vite
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── main.jsx                 # Entry point
│       ├── App.jsx                  # Componente raíz (orquestador)
│       │
│       ├── components/              # UI pura, sin lógica de negocio
│       │   ├── CharacterRow.jsx     # Fila del dashboard
│       │   ├── CharacterForm.jsx    # Formulario crear/editar personaje
│       │   ├── ProgressEditor.jsx   # Editor de progreso semanal
│       │   ├── MatchingPanel.jsx    # Panel de matching entre jugadores
│       │   ├── Modal.jsx            # Wrapper de modal genérico
│       │   └── ui.jsx               # StatusDot, ProgressBar, Toggle
│       │
│       ├── hooks/                   # Estado + efectos (sin UI)
│       │   ├── useCharacters.js     # CRUD de personajes
│       │   └── useProgress.js       # Progreso semanal
│       │
│       ├── services/                # Capa de comunicación con el backend
│       │   ├── apiClient.js         # fetch centralizado con manejo de errores
│       │   ├── characterService.js  # GET/POST/PUT/DELETE /characters
│       │   └── progressService.js   # GET/POST /progress + reset
│       │
│       ├── utils/                   # Lógica pura, sin dependencias de React
│       │   ├── constants.js         # CLASS_COLORS, BOSSES, MAX_LEVEL, etc.
│       │   └── progressUtils.js     # calculateProgressScore, buildMatchingPairs, etc.
│       │
│       └── data/
│           └── mockData.js          # Datos iniciales (se elimina al conectar DB)
│
└── backend/                         # Node.js + Express
    ├── server.js                    # Entry point (arranca el servidor)
    ├── package.json
    ├── .env.example
    └── src/
        ├── app.js                   # Express config, middleware, rutas
        │
        ├── routes/                  # Define las URLs
        │   ├── character.routes.js  # GET/POST/PUT/DELETE /api/characters
        │   └── progress.routes.js   # GET/POST /api/progress + /reset
        │
        ├── controllers/             # Recibe HTTP, delega al service
        │   ├── character.controller.js
        │   └── progress.controller.js
        │
        ├── services/                # Lógica de negocio + acceso a datos
        │   ├── character.service.js
        │   └── progress.service.js
        │
        ├── models/                  # Tipos, validaciones y schema SQL
        │   ├── character.model.js
        │   └── progress.model.js
        │
        └── db/
            ├── connection.js        # Mock en memoria / PostgreSQL / Supabase
            └── seedData.js          # Datos iniciales
```

---

## Flujo de datos

```
Usuario
  │
  ▼
Component (CharacterRow, MatchingPanel...)
  │  props / callbacks
  ▼
App.jsx (orquestador de estado)
  │  llama a hooks
  ▼
useCharacters / useProgress
  │  llama a services
  ▼
characterService / progressService      ← cambia USE_MOCK para alternar
  │  modo mock: opera sobre array local
  │  modo real: llama a apiClient
  ▼
apiClient.js  ──────────────────────────────────────────────────►  Backend
                              fetch /api/characters                  │
                                                                     ▼
                                                              character.routes.js
                                                                     │
                                                              character.controller.js
                                                                     │
                                                              character.service.js
                                                                     │
                                                              db/connection.js
                                                                     │
                                                         Mock en memoria / PostgreSQL / Supabase
```

---

## Instalación y desarrollo

### 1. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev       # http://localhost:5173
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev       # http://localhost:3001
```

El frontend ya tiene un proxy configurado en `vite.config.js`:  
todas las requests a `/api/*` se redirigen automáticamente al backend en desarrollo.

---

## API Reference

### Characters

| Método | Ruta                    | Descripción               |
|--------|-------------------------|---------------------------|
| GET    | `/api/characters`       | Listar todos              |
| GET    | `/api/characters/:id`   | Obtener uno por ID        |
| POST   | `/api/characters`       | Crear nuevo               |
| PUT    | `/api/characters/:id`   | Actualizar                |
| DELETE | `/api/characters/:id`   | Eliminar                  |

**Ejemplo POST /api/characters:**
```json
{
  "owner":       "Cristian",
  "name":        "Ahksagi",
  "level":       90,
  "itemLevel":   620,
  "faction":     "Horde",
  "realm":       "Ragnaros",
  "class":       "Paladin",
  "spec":        "Retribution",
  "professions": ["Blacksmithing", "Mining"]
}
```

### Progress

| Método | Ruta                    | Descripción                              |
|--------|-------------------------|------------------------------------------|
| GET    | `/api/progress`         | Todos los registros (mapa por charId)    |
| POST   | `/api/progress`         | Crear o actualizar (upsert)              |
| POST   | `/api/progress/reset`   | Resetear semana para lista de personajes |

**Ejemplo POST /api/progress:**
```json
{
  "characterId":  "c01",
  "weekId":       "2026-W12",
  "abismos":      3,
  "lfr":          false,
  "normalBosses": ["Ulgrax", "Bloodbound Horror"],
  "heroicBosses": [],
  "hunt":         true,
  "weeklyQuest":  false,
  "knowledge":    10
}
```

**Ejemplo POST /api/progress/reset:**
```json
{
  "characterIds": ["c01", "c02", "n01"],
  "weekId":       "2026-W13"
}
```

---

## Activar el backend real (PostgreSQL o Supabase)

### Paso 1 — Crear la base de datos

Ejecutar el SQL de los modelos (incluido en los comentarios de cada `*.model.js`):

```sql
CREATE TABLE characters (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner       VARCHAR(50)  NOT NULL,
  name        VARCHAR(100) NOT NULL,
  level       INTEGER      NOT NULL DEFAULT 1,
  item_level  INTEGER      NOT NULL DEFAULT 0,
  faction     VARCHAR(20)  NOT NULL,
  realm       VARCHAR(100) NOT NULL,
  class       VARCHAR(50)  NOT NULL,
  spec        VARCHAR(50),
  professions TEXT[]       NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE weekly_progress (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id   UUID        NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  week_id        VARCHAR(10) NOT NULL,
  abismos        INTEGER     NOT NULL DEFAULT 0,
  lfr            BOOLEAN     NOT NULL DEFAULT false,
  normal_bosses  TEXT[]      NOT NULL DEFAULT '{}',
  heroic_bosses  TEXT[]      NOT NULL DEFAULT '{}',
  hunt           BOOLEAN     NOT NULL DEFAULT false,
  weekly_quest   BOOLEAN     NOT NULL DEFAULT false,
  knowledge      INTEGER     NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(character_id, week_id)
);
```

### Paso 2 — Configurar variables de entorno en el backend

```bash
# backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wow_tracker
DB_USER=postgres
DB_PASSWORD=tu_password
```

### Paso 3 — Activar el cliente real en `db/connection.js`

Descomentar el bloque de `node-postgres` (o Supabase) y comentar el bloque mock.

### Paso 4 — Activar los services reales en el frontend

En `characterService.js` y `progressService.js`, cambiar:

```js
const USE_MOCK = false;   // ← cambiar de true a false
```

---

## Deploy en producción

### Frontend → Netlify

```bash
cd frontend
npm run build
# Subir /dist a Netlify, o conectar el repo con auto-deploy
# Variable de entorno: VITE_API_URL=https://tu-backend.com/api
```

### Backend → Railway / Render / VPS

```bash
cd backend
# Variables de entorno según plataforma
npm start
```

---

## Añadir autenticación (futura implementación)

La arquitectura ya está preparada:

1. **Backend:** agregar middleware `auth.middleware.js` que valide JWT antes de los controllers.
2. **Frontend:** `apiClient.js` ya tiene el comentario donde insertar el `Authorization` header.
3. **DB:** agregar tabla `users` y columna `user_id` en `characters`.

```js
// apiClient.js — descomentar cuando auth esté lista:
// "Authorization": `Bearer ${getToken()}`,
```
