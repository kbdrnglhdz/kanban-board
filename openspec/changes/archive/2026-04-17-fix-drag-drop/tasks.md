## 1. Modificar componentes de frontend para soportar índice de drop

- [x] 1.1 Modificar `Column.tsx` para detectar posición de drop (usar `e.clientY` o similar)
- [x] 1.2 Actualizar `handleDrop` en `Column.tsx` para pasar `dropIndex`
- [x] 1.3 Modificar `Board.tsx` para recibir `dropIndex` en `handleDrop`

## 2. Actualizar hook useTasks para manejar reordenamiento

- [x] 2.1 Agregar estado `isMoving` en `useTasks.ts`
- [x] 2.2 Implementar lógica de cálculo de nuevo `order` basándose en `dropIndex`
- [x] 2.3 Agregar lógica de gap strategy (primera posición, entre tasks, última posición)
- [x] 2.4 Actualizar `updateTask` para usar nuevo `order`
- [x] 2.5 Exponer `isMoving` en el return del hook

## 3. Agregar feedback visual durante operaciones

- [x] 3.1 Mostrar indicador de carga en `Column.tsx` cuando `isMoving` es true
- [x] 3.2 Deshabilitar drop zones durante operaciones en curso
- [x] 3.3 Agregar estilos CSS para el estado de "moviendo"

## 4. Verificar backend PUT /tasks/:id

- [x] 4.1 Verificar que endpoint acepta y persiste el campo `order`
- [x] 4.2 Corregir bug #3 si PUT no actualiza `order` correctamente

## 5. Testing y verificación

- [x] 5.1 Probar mover tarea dentro de la misma columna
- [x] 5.2 Probar mover tarea entre columnas diferentes
- [x] 5.3 Probar múltiples movimientos consecutivos
- [x] 5.4 Verificar que no hay duplicación ni pérdida de tareas

## 6. Correcciones adicionales

- [x] 6.1 Corregir status 'done' -> 'completed' en Board.tsx (incompatibilidad con backend)
- [x] 6.2 Agregar CSS para disabled y loading-overlay
