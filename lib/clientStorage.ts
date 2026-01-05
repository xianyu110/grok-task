// 纯前端 localStorage 存储
export interface Task {
  id: string;
  name: string;
  description?: string;
  prompt: string;
  schedule: string;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
  templateId?: string;
}

export interface TaskExecution {
  id: string;
  taskId: string;
  status: 'success' | 'failed';
  result?: string;
  error?: string;
  executedAt: string;
}

export interface ApiConfig {
  apiKey: string;
  apiBase: string;
  model: string;
}

const STORAGE_KEYS = {
  TASKS: 'grok_tasks',
  EXECUTIONS: 'grok_executions',
  API_CONFIG: 'grok_api_config',
};

// API 配置管理
export const getApiConfig = (): ApiConfig => {
  if (typeof window === 'undefined') return { apiKey: '', apiBase: '', model: '' };

  const stored = localStorage.getItem(STORAGE_KEYS.API_CONFIG);
  if (stored) {
    return JSON.parse(stored);
  }

  // 默认配置
  return {
    apiKey: '',
    apiBase: 'https://apipro.maynor1024.live/v1',
    model: 'grok-4.1-fast',
  };
};

export const saveApiConfig = (config: ApiConfig): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.API_CONFIG, JSON.stringify(config));
};

// 任务管理
export const getTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
  return stored ? JSON.parse(stored) : [];
};

export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

export const getTask = (id: string): Task | undefined => {
  return getTasks().find(task => task.id === id);
};

export const createTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
  const newTask: Task = {
    ...task,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const tasks = getTasks();
  tasks.push(newTask);
  saveTasks(tasks);

  return newTask;
};

export const updateTask = (id: string, updates: Partial<Task>): Task | undefined => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) return undefined;

  tasks[index] = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveTasks(tasks);
  return tasks[index];
};

export const deleteTask = (id: string): boolean => {
  const tasks = getTasks();
  const filtered = tasks.filter(t => t.id !== id);

  if (filtered.length === tasks.length) return false;

  saveTasks(filtered);

  // 同时删除相关的执行历史
  const executions = getExecutions();
  const filteredExecs = executions.filter(e => e.taskId !== id);
  saveExecutions(filteredExecs);

  return true;
};

// 执行历史管理
export const getExecutions = (): TaskExecution[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEYS.EXECUTIONS);
  return stored ? JSON.parse(stored) : [];
};

export const saveExecutions = (executions: TaskExecution[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.EXECUTIONS, JSON.stringify(executions));
};

export const getTaskExecutions = (taskId: string): TaskExecution[] => {
  return getExecutions()
    .filter(exec => exec.taskId === taskId)
    .sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime());
};

export const addExecution = (execution: Omit<TaskExecution, 'id'>): TaskExecution => {
  const newExecution: TaskExecution = {
    ...execution,
    id: Date.now().toString(),
  };

  const executions = getExecutions();
  executions.push(newExecution);

  // 只保留最近 50 条记录
  if (executions.length > 50) {
    executions.sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime());
    executions.splice(50);
  }

  saveExecutions(executions);
  return newExecution;
};
