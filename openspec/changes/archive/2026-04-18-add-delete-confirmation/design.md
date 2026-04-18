## Context

El proyecto es un tablero Kanban con frontend React y backend Express. Las tareas se eliminan mediante el botón "Eliminar" en cada tarjeta, sin embargo el código actual ejecuta `onDelete(task.id)` directamente sin ninguna confirmación por parte del usuario.

## Goals / Non-Goals

**Goals:**
- Añadir confirmación antes de eliminar tareas
- Mantener la simplicidad de implementación
- No alterar la funcionalidad existente del backend

**Non-Goals:**
- No se implementará un modal personalizado (fuera del alcance)
- No se modificará el comportamiento del backend

## Decisiones

- **Decisión**: Usar `window.confirm()` nativo del navegador
  - **Alternativa considerada**: Crear un componente Modal personalizado
  - **Rationale**: Solución simple, sin dependencias adicionales, mantiene el código liviano. El `confirm()` es suficiente para el caso de uso actual.

## Riesgos / Trade-offs

- **Riesgo**: El diálogo nativo tiene styling limitado
  - **Mitigación**: Aceptable para este caso de uso; si en el futuro se requiere mejor UX, se puede migrar a un modal personalizado

## Migration Plan

1. Modificar `frontend/src/components/TaskCard.tsx` para añadir el `confirm()`
2. Verificar funcionamiento manual

No requiere migración de datos ni cambios en el backend.

## Open Questions

Ninguna