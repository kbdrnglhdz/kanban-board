import React from 'react';
import { Task } from '../types';
import TaskCard from './TaskCard';

interface ColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  onDragStart: (task: Task) => void;
  onDrop: (status: Task['status']) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Task>) => void;
}

const Column: React.FC<ColumnProps> = ({ title, status, tasks, onDragStart, onDrop, onDelete, onUpdate }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="column"
      onDragOver={handleDragOver}
      onDrop={() => onDrop(status)}
    >
      <h2>{title}</h2>
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