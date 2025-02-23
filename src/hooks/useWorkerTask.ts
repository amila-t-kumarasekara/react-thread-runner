'use client';

import { useState, useCallback } from 'react';
import { WorkerPool } from '../utils/pool';
import { WorkerTask, WorkerOptions } from '../utils/types';

export function useWorkerTask(options: WorkerOptions = {}) {

  const workerPool = new WorkerPool({ maxWorkers: options.maxWorkers ?? 4 });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const runTask = useCallback(async <T>(task: WorkerTask<T>): Promise<T> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await workerPool.execute(task);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    runTask,
    isLoading,
    error
  };
}