## Why

El botón "Eliminar" en las tarjetas de tareas elimina instantáneamente sin pedir confirmación al usuario. Esto puede causar eliminaciones accidentales sin forma de recuperarlas, afectando la experiencia de usuario y la integridad de los datos.

## What Changes

- Añadir diálogo de confirmación nativo (`window.confirm()`) antes de ejecutar la eliminación de tarea
- Mostrar mensaje claro: "¿Estás seguro de que quieres eliminar esta tarea?"
- Solo ejecutar la eliminación si el usuario confirma

## Capabilities

### New Capabilities
- `confirm-delete`: Diálogo de confirmación antes de eliminar tareas

### Modified Capabilities
- Ninguno

## Impact

- **Archivo modificado**: `frontend/src/components/TaskCard.tsx`
- **Dependencias**: Ninguna nueva (usa API nativa del navegador)
- **Compatibilidad**: No hay cambios en la API ni en el comportamiento del backend