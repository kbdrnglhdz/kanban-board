---
description: Mueve una tarea a otra columna
---

curl -X PUT http://localhost:3000/tasks/$1 -H "Content-Type: application/json" -d '{"status":"$2"}'