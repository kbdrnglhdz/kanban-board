import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';
import Column from './Column';
import AddTaskForm from './AddTaskForm';

const Board: React.FC = () => {
  const { tasks, updateTask, deleteTask, addTask, isMoving, setIsMoving } = useTasks();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDrop = (targetStatus: Task['status'], dropIndex: number) => {
    if (!draggedTask) return;
    
    setIsMoving(true);
    
    const targetTasks = tasks.filter(t => t.status === targetStatus);
    targetTasks.sort((a, b) => a.order - b.order);
    
    let newOrder: number;
    
    if (targetTasks.length === 0) {
      newOrder = 1;
    } else if (dropIndex === 0) {
      newOrder = targetTasks[0].order - 1000 || 1;
    } else if (dropIndex >= targetTasks.length) {
      newOrder = targetTasks[targetTasks.length - 1].order + 1000;
    } else {
      const prevOrder = targetTasks[dropIndex - 1].order;
      const nextOrder = targetTasks[dropIndex].order;
      newOrder = Math.floor((prevOrder + nextOrder) / 2);
    }

    updateTask(draggedTask.id, { status: targetStatus, order: newOrder }).finally(() => {
      setIsMoving(false);
      setDraggedTask(null);
    });
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
          disabled={isMoving}
        />
        <Column
          title="En Progreso"
          status="in-progress"
          tasks={tasksByStatus('in-progress')}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDelete={deleteTask}
          onUpdate={updateTask}
          disabled={isMoving}
        />
        <Column
          title="Hecho"
          status="completed"
          tasks={tasksByStatus('completed')}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDelete={deleteTask}
          onUpdate={updateTask}
          disabled={isMoving}
        />
      </div>
    </div>
  );
};

export default Board;