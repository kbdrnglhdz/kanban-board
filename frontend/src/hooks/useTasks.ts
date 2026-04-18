import { useState, useEffect } from 'react';
import { Task } from '../types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    setTasks(data);
  };

  const addTask = async (title: string, status: Task['status']) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, status }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Error al crear la tarea');
    }
    const newTask = await res.json();
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    await fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    await fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, addTask, updateTask, deleteTask, loading, isMoving, setIsMoving };
}