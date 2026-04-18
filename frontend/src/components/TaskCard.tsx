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
      <button onClick={() => {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
          onDelete(task.id);
        }
      }}>Eliminar</button>
    </div>
  );
};

export default TaskCard;