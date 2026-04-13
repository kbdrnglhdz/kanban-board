## 📦 Proyecto Base: Tablero Kanban Simple (React + TS + Vite + SQLite)

### Descripción
Aplicación web de tablero Kanban con columnas (Pendiente, En Progreso, Hecho). Permite crear, mover, editar y eliminar tareas. **Contiene problemas intencionales** que el agente OpenCode deberá detectar y solucionar.

### Tecnologías
- **Frontend:** React 18 + TypeScript + Vite + CSS modular
- **Backend:** Node.js + Express + SQLite3 (base de datos)
- **Comunicación:** API REST

### Problemas intencionales (no bloqueantes pero visibles)

#### Backend (API)
1. **GET /tasks** – A veces devuelve tareas con `status` incorrecto (aleatorio: 1 de cada 5 respuestas, cambia "pending" por "in-progress" sin motivo).
2. **POST /tasks** – No valida que `title` no esté vacío (crea tareas sin título). Tampoco valida `status` (acepta valores no permitidos).
3. **PUT /tasks/:id** – Al actualizar el `order`, no reordena las demás tareas (rompe ordenación). Además, permite cambiar `status` a cualquier string, incluso inválido.
4. **DELETE /tasks/:id** – No elimina realmente (solo marca `deleted_at` pero el GET aún las devuelve si no se filtra).

#### Frontend (React)
5. **Arrastrar y soltar** – Al mover tarea entre columnas, a veces se duplica o desaparece.
6. **Botón "Eliminar"** – No pide confirmación y elimina sin advertencia.
7. **Crear tarea** – Si falla, no muestra mensaje de error (silencio).
8. **Estado de carga** – No hay indicador mientras se cargan las tareas (parece que no pasa nada).

### Endpoints para probar (CURL)

```bash
# 1. Obtener tareas (a veces status incorrecto)
curl -X GET http://localhost:3000/tasks

# 2. Crear tarea (permite título vacío y status inválido)
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"", "status":"invalid"}'

# 3. Actualizar orden (rompe orden de otras)
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"order": 99}'

# 4. Actualizar status a valor inválido
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"fake-status"}'

# 5. Eliminar tarea (no la borra realmente)
curl -X DELETE http://localhost:3000/tasks/1

# Después del DELETE, el GET aún muestra la tarea (problema)
curl -X GET http://localhost:3000/tasks
```

### Estructura del proyecto

```
kanban-board/
├── backend/
│   ├── src/
│   │   ├── db.js           # Configuración SQLite
│   │   ├── server.js       # API con problemas intencionales
│   │   └── init-db.js      # Inicializa base de datos
│   ├── package.json
│   └── kanban.db           (se genera al iniciar)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board.tsx
│   │   │   ├── Column.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── AddTaskForm.tsx
│   │   ├── hooks/
│   │   │   └── useTasks.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

### Código base (para empezar el taller)

#### Backend

**backend/src/db.js** (configuración SQLite)
```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../kanban.db'));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      "order" INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deleted_at DATETIME
    )
  `);
});

module.exports = db;
```

**backend/src/init-db.js** (poblar con datos iniciales)
```javascript
const db = require('./db');

db.serialize(() => {
  db.run("DELETE FROM tasks");
  const tasks = [
    { title: "Diseñar la interfaz", status: "pending", order: 1 },
    { title: "Implementar drag & drop", status: "pending", order: 2 },
    { title: "Conectar API", status: "in-progress", order: 3 },
    { title: "Probar en navegadores", status: "done", order: 4 },
  ];
  const stmt = db.prepare("INSERT INTO tasks (title, status, order) VALUES (?, ?, ?)");
  tasks.forEach(t => stmt.run(t.title, t.status, t.order));
  stmt.finalize();
  console.log("Base de datos inicializada");
});
```

**backend/src/server.js** (API con problemas intencionales)
```javascript
const express = require('express');
const db = require('./db');
const app = express();
app.use(express.json());
app.use(express.static('../frontend/dist')); // para producción, en desarrollo usamos Vite proxy

// PROBLEMA 1: GET /tasks a veces devuelve status incorrecto
app.get('/tasks', (req, res) => {
  db.all("SELECT id, title, status, order FROM tasks WHERE deleted_at IS NULL ORDER BY order", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Problema intencional: 1 de cada 5 respuestas modifica status
    if (Math.random() < 0.2) {
      const corrupted = rows.map(t => ({
        ...t,
        status: t.status === 'pending' ? 'in-progress' : 'pending'
      }));
      return res.json(corrupted);
    }
    res.json(rows);
  });
});

// PROBLEMA 2: POST /tasks no valida título vacío ni status válido
app.post('/tasks', (req, res) => {
  const { title, status = 'pending' } = req.body;
  // No validamos title
  // Permitimos cualquier status, incluso inválido
  const orderQuery = "SELECT COALESCE(MAX(order), 0) + 1 as newOrder FROM tasks";
  db.get(orderQuery, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    const newOrder = row.newOrder;
    db.run("INSERT INTO tasks (title, status, order) VALUES (?, ?, ?)",
      [title || '', status, newOrder],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, title, status, order: newOrder });
      });
  });
});

// PROBLEMA 3: PUT /tasks/:id - actualiza order sin reordenar y permite status inválido
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const { title, status, order } = req.body;
  let updateFields = [];
  let values = [];
  if (title !== undefined) {
    updateFields.push("title = ?");
    values.push(title);
  }
  if (status !== undefined) {
    updateFields.push("status = ?");
    values.push(status);
  }
  if (order !== undefined) {
    updateFields.push("order = ?");
    values.push(order);
    // PROBLEMA: no reordenamos las demás tareas
  }
  if (updateFields.length === 0) return res.status(400).json({ error: "No fields to update" });
  values.push(id);
  const sql = `UPDATE tasks SET ${updateFields.join(", ")} WHERE id = ?`;
  db.run(sql, values, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "updated" });
  });
});

// PROBLEMA 4: DELETE /tasks/:id - soft delete pero GET aún las filtra (ya filtramos deleted_at IS NULL en GET, ¡pero no en otros endpoints!)
// En realidad GET ya filtra, pero si el DELETE solo marca deleted_at, funciona bien. Cambiemos: GET no filtra deleted_at para que el problema sea visible.
// Modifiquemos GET para que NO filtre deleted_at, así se ve el problema.
// (Pero en el código de GET de arriba ya filtra. Para crear el problema, eliminamos esa condición)
// Para este taller, ajustamos GET para que ignore deleted_at:
app.get('/tasks-bug', (req, res) => {
  db.all("SELECT id, title, status, order FROM tasks ORDER BY order", (err, rows) => {
    // Mismo problema de status
    if (Math.random() < 0.2) {
      const corrupted = rows.map(t => ({
        ...t,
        status: t.status === 'pending' ? 'in-progress' : 'pending'
      }));
      return res.json(corrupted);
    }
    res.json(rows);
  });
});
// Pero para mantener coherencia, haremos que GET /tasks original (el usado por frontend) tenga el bug de no filtrar deleted_at.
// Reescribamos el GET real para que no filtre deleted_at.
app.get('/tasks', (req, res) => {
  db.all("SELECT id, title, status, order FROM tasks ORDER BY order", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (Math.random() < 0.2) {
      const corrupted = rows.map(t => ({
        ...t,
        status: t.status === 'pending' ? 'in-progress' : 'pending'
      }));
      return res.json(corrupted);
    }
    res.json(rows);
  });
});

app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  // Soft delete
  db.run("UPDATE tasks SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?", id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Task not found" });
    res.status(204).send();
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
```

**backend/package.json**
```json
{
  "name": "kanban-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/server.js",
    "init-db": "node src/init-db.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6"
  }
}
```

#### Frontend (React + TypeScript + Vite)

**frontend/package.json**
```json
{
  "name": "kanban-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}
```

**frontend/vite.config.ts**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

**frontend/src/types/index.ts**
```typescript
export type TaskStatus = 'pending' | 'in-progress' | 'done';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  order: number;
}
```

**frontend/src/hooks/useTasks.ts** (con problemas intencionales)
```typescript
import { useState, useEffect } from 'react';
import { Task } from '../types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false); // PROBLEMA 8: nunca se usa loading (no hay indicador)

  const fetchTasks = async () => {
    // PROBLEMA: no hay manejo de estado de carga
    const res = await fetch('/api/tasks');
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async (title: string, status: TaskStatus) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, status }),
    });
    if (!res.ok) {
      // PROBLEMA 7: no muestra error, solo falla silenciosamente
      return;
    }
    const newTask = await res.json();
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    await fetchTasks(); // recargar todo (ineficiente)
  };

  const deleteTask = async (id: number) => {
    // PROBLEMA 6: no pide confirmación
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    await fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, addTask, updateTask, deleteTask, loading };
}
```

**frontend/src/components/Board.tsx** (drag & drop con problemas)
```tsx
import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TaskStatus, Task } from '../types';
import Column from './Column';
import AddTaskForm from './AddTaskForm';

const Board: React.FC = () => {
  const { tasks, updateTask, deleteTask, addTask } = useTasks();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDrop = (targetStatus: TaskStatus) => {
    if (!draggedTask) return;
    // PROBLEMA 5: a veces duplica o desaparece (no se elimina correctamente de origen)
    // Además, no se actualiza el order correctamente
    updateTask(draggedTask.id, { status: targetStatus });
    setDraggedTask(null);
  };

  const tasksByStatus = (status: TaskStatus) =>
    tasks.filter(t => t.status === status).sort((a, b) => a.order - b.order);

  return (
    <div className="board">
      <AddTaskForm onAdd={addTask} />
      <div className="columns">
        <Column
          title="Pendiente"
          status="pending"
          tasks={tasksByStatus('pending')}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
        <Column
          title="En Progreso"
          status="in-progress"
          tasks={tasksByStatus('in-progress')}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
        <Column
          title="Hecho"
          status="done"
          tasks={tasksByStatus('done')}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
      </div>
    </div>
  );
};

export default Board;
```

**frontend/src/components/Column.tsx**
```tsx
import React from 'react';
import { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDragStart: (task: Task) => void;
  onDrop: (status: TaskStatus) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Task>) => void;
}

const Column: React.FC<ColumnProps> = ({ title, status, tasks, onDragStart, onDrop, onDelete, onUpdate }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="column"
      onDragOver={handleDragOver}
      onDrop={() => onDrop(status)}
    >
      <h2>{title}</h2>
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onDragStart={onDragStart}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default Column;
```

**frontend/src/components/TaskCard.tsx**
```tsx
import React from 'react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onDragStart: (task: Task) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Task>) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, onDelete, onUpdate }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id.toString());
    onDragStart(task);
  };

  return (
    <div
      className="task-card"
      draggable
      onDragStart={handleDragStart}
    >
      <span>{task.title}</span>
      <button onClick={() => onDelete(task.id)}>Eliminar</button>
      {/* PROBLEMA 6: sin confirmación */}
    </div>
  );
};

export default TaskCard;
```

**frontend/src/components/AddTaskForm.tsx** (problema 7: sin manejo de errores)
```tsx
import React, { useState } from 'react';
import { TaskStatus } from '../types';

interface AddTaskFormProps {
  onAdd: (title: string, status: TaskStatus) => Promise<void>;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return; // problema: no hay mensaje de error
    await onAdd(title, status);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título de la tarea"
      />
      <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
        <option value="pending">Pendiente</option>
        <option value="in-progress">En Progreso</option>
        <option value="done">Hecho</option>
      </select>
      <button type="submit">Agregar</button>
    </form>
  );
};

export default AddTaskForm;
```

**frontend/src/App.tsx**
```tsx
import React from 'react';
import Board from './components/Board';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>Tablero Kanban</h1>
      <Board />
    </div>
  );
}

export default App;
```

**frontend/src/App.css** (estilos básicos)
```css
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.board {
  display: flex;
  flex-direction: column;
}
.columns {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
.column {
  flex: 1;
  background: #f4f5f7;
  border-radius: 8px;
  padding: 10px;
  min-height: 400px;
}
.task-card {
  background: white;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
}
```

**frontend/src/main.tsx** (estándar)
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**frontend/index.html**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kanban Board</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```