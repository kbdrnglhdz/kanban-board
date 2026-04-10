export type TaskStatus = 'pending' | 'in-progress' | 'done';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  order: number;
}