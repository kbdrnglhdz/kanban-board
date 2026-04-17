---
description: Muestra el número de tareas por columna en Markdown
---

# Status de Tareas

Genera un reporte Markdown con el conteo de tareas por estado.

`!curl -s http://localhost:3000/tasks | node -e "
const tasks = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
console.log('## Tareas por Estado\n');
console.log('| Estado       | Cantidad |');
console.log('|--------------|----------|');
['pending', 'in-progress', 'done'].forEach(status => {
  const count = tasks.filter(t => t.status === status).length;
  console.log('| ' + status.padEnd(12) + ' | ' + count.toString().padStart(8) + ' |');
});
console.log('\n**Total:** ' + tasks.length + ' tareas');
"`
