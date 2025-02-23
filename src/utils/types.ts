export type WorkerTask<T = any> = () => Promise<T>;

export type WorkerResult<T> = {
  success: boolean;
  data?: T;
  error?: Error;
};

export type WorkerOptions = {
  maxWorkers?: number;
  timeout?: number;
};

export type TaskController = {
  cancel: () => void;
  promise: Promise<any>;
};