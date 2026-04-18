import React, { useState } from 'react';
import { TaskStatus } from '../types';

interface AddTaskFormProps {
  onAdd: (title: string, status: TaskStatus) => Promise<void>;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setError(null);
    try {
      await onAdd(title, status);
      setTitle('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la tarea');
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (error) setError(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Título de la tarea"
      />
      <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
        <option value="pending">Pendiente</option>
        <option value="in-progress">En Progreso</option>
        <option value="completed">Hecho</option>
      </select>
      <button type="submit">Agregar</button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default AddTaskForm;