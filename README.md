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

# Para mantener el servidor activo en segundo plano en Linux:
nohup npm run dev > /tmp/vite.log 2>&1 &
```

# Para mantener el servidor activo en segundo plano en Windows:

* **Powershell**
Start-Process -WindowStyle Hidden -FilePath "npm" -ArgumentList "run dev" -RedirectStandardOutput "C:\temp\vite.log" -RedirectStandardError "C:\temp\vite.log"
* **CMD**
- Crear la carpeta temp si no existe
mkdir C:\temp 2>nul
- Ejecutar en segundo plano
start /b npm run dev > C:\temp\vite.log 2>&1

## Solución de problemas

Si el navegador no puede cargar la página:

1. Verificar que el backend esté corriendo:
   ```bash
   curl http://localhost:3000/api/tasks
   ```

2. Verificar que el frontend esté corriendo:
   ```bash
   curl http://localhost:5173/
   ```

3. Si hay error de puerto, especificar el puerto manualmente en `frontend/vite.config.ts`:
   ```typescript
   server: {
     port: 5173,
     // ...
   }
   ```

## Bugs intencionales (8)

Los 8 bugs descritos en `workshop/proyecto.md` están presentes para ser corregidos.