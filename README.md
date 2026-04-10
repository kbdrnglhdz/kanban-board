# Kanban Board

Tablero Kanban con React + TypeScript + Vite + Express + SQLite.

## Estructura

```
kanban-board/
├── backend/          # Express + SQLite
│   └── src/
│       ├── db.js
│       ├── server.js
│       └── init-db.js
└── frontend/         # React + Vite
    └── src/
        ├── components/
        ├── hooks/
        └── types/
```

## Ejecutar

```bash
# Backend
cd backend
npm install
npm run init-db
npm start

# Frontend (otra terminal)
cd frontend
npm install
npm run dev
```

## Bugs intencionales (8)

Los 8 bugs descritos en `workshop/proyecto.md` están presentes para ser corregidos.