export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  order: number;
}