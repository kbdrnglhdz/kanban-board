const db = require('./db');

db.serialize(() => {
  db.run("DELETE FROM tasks");
  const tasks = [
    { title: "Diseñar la interfaz", status: "pending", order: 1 },
    { title: "Implementar drag & drop", status: "pending", order: 2 },
    { title: "Conectar API", status: "in-progress", order: 3 },
    { title: "Probar en navegadores", status: "done", order: 4 },
  ];
  const stmt = db.prepare("INSERT INTO tasks (title, status, [order]) VALUES (?, ?, ?)");
  tasks.forEach(t => stmt.run(t.title, t.status, t.order));
  stmt.finalize();
  console.log("Base de datos inicializada");
});