# Gestor de Tareas React

Un componente React simple para gestionar tareas en una aplicación web.

## Características

- Añadir nuevas tareas
- Marcar tareas como completadas
- Eliminar tareas
- Mostrar estadísticas de tareas (total y completadas)
- Integración con JavaScript externo mediante eventos

## Uso

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```
3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Integración con JavaScript Externo

El componente puede recibir tareas desde cualquier parte de la aplicación usando eventos personalizados:

```javascript
// Para añadir una nueva tarea
const event = new CustomEvent('injectTask', { detail: 'Nombre de la tarea' });
document.dispatchEvent(event);

// Para escuchar cambios en el contador de tareas
document.addEventListener('taskCountUpdated', function(e) {
    const { total, completed } = e.detail;
    // Actualiza tu interfaz con los nuevos valores
});
```