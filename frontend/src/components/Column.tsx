import React from 'react';
import { Task } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  onDragStart: (task: Task) => void;
  onDrop: (status: Task['status'], dropIndex: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Task>) => void;
  disabled?: boolean;
}

const Column: React.FC<ColumnProps> = ({ title, status, tasks, onDragStart, onDrop, onDelete, onUpdate, disabled }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getDropIndex = (e: React.DragEvent): number => {
    const taskElements = Array.from(e.currentTarget.querySelectorAll('.task-card'));
    let dropIndex = taskElements.length;

    for (let i = 0; i < taskElements.length; i++) {
      const rect = taskElements[i].getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      if (e.clientY < midY) {
        dropIndex = i;
        break;
      }
    }

    return dropIndex;
  };

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    const dropIndex = getDropIndex(e);
    onDrop(status, dropIndex);
  };

  return (
    <div
      className={`column ${disabled ? 'disabled' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2>{title}</h2>
      {disabled && <div className="loading-overlay">Moviendo...</div>}
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