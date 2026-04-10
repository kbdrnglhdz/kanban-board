import React, { useState } from 'react';
import { TaskStatus } from '../types';

interface AddTaskFormProps {
  onAdd: (title: string, status: TaskStatus) => Promise<void>;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await onAdd(title, status);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título de la tarea"
      />
      <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
        <option value="pending">Pendiente</option>
        <option value="in-progress">En Progreso</option>
        <option value="done">Hecho</option>
      </select>
      <button type="submit">Agregar</button>
    </form>
  );
};

export default AddTaskForm;