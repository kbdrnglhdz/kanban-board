import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';
import Column from './Column';
import AddTaskForm from './AddTaskForm';

const Board: React.FC = () => {
  const { tasks, updateTask, deleteTask, addTask } = useTasks();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDrop = (targetStatus: Task['status']) => {
    if (!draggedTask) return;
    updateTask(draggedTask.id, { status: targetStatus });
    setDraggedTask(null);
  };

  const tasksByStatus = (status: Task['status']) =>
    tasks.filter(t => t.status === status).sort((a, b) => a.order - b.order);

  return (
    <div className="board">
      <AddTaskForm onAdd={addTask} />
      <div className="columns">
        <Column
          title="Pendiente"
          status="pending"
          tasks={tasksByStatus('pending')}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
        <Column
          title="En Progreso"
          status="in-progress"
          tasks={tasksByStatus('in-progress')}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
        <Column
          title="Hecho"
          status="done"
          tasks={tasksByStatus('done')}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
      </div>
    </div>
  );
};

export default Board;