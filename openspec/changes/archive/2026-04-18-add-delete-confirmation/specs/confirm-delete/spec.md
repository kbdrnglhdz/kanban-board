## ADDED Requirements

### Requirement: Confirmar eliminación de tarea
El sistema DEBE mostrar un diálogo de confirmación antes de eliminar una tarea.

#### Scenario: Usuario confirma eliminación
- **WHEN** usuario hace clic en "Eliminar" y confirma en el diálogo
- **THEN** el sistema elimina la tarea

#### Scenario: Usuario cancela eliminación
- **WHEN** usuario hace clic en "Eliminar" pero cancela en el diálogo
- **THEN** el sistema NO elimina la tarea y la tarea permanece visible