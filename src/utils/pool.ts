import { BrowserWorker } from '../workers/browser';
import { WorkerOptions } from './types';

export class WorkerPool {
  private readonly workers: BrowserWorker[] = [];
  private readonly queue: Array<{
    task: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (reason?: unknown) => void;
  }> = [];
  private readonly maxWorkers: number;

  constructor(options: WorkerOptions) {
    this.maxWorkers = options.maxWorkers ?? navigator.hardwareConcurrency ?? 4;
  }

  execute<T>(task: () => T | Promise<T>): Promise<T> {
    const workerCode = `
      self.onmessage = async function(e) {
        try {
          const taskFn = (${task.toString()});
          const result = await taskFn();
          self.postMessage({ type: 'success', result });
        } catch (error) {
          self.postMessage({ type: 'error', error: error.message });
        }
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    return new Promise((resolve, reject) => {
      worker.onmessage = (e) => {
        if (e.data.type === 'success') {
          resolve(e.data.result);
        } else {
          reject(new Error(e.data.error));
        }
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
      };

      worker.postMessage(null);
    });
  }

  private getAvailableWorker(): BrowserWorker | null {
    if (this.workers.length < this.maxWorkers) {
      const worker = new BrowserWorker(this.workerFunction);
      this.workers.push(worker);
      return worker;
    }
    return null;
  }

  private workerFunction() {
    self.onmessage = async (event) => {
      try {
        const taskFn = new Function(`return ${event.data.task}`)();
        const result = await taskFn();
        self.postMessage({ result });
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        self.postMessage({ error: errorMessage });
      }
    };
  }

  private async runTask<T>(
    worker: BrowserWorker,
    task: () => Promise<T>,
    resolve: (value: T) => void,
    reject: (reason?: unknown) => void
  ) {
    try {
      const result = await worker.execute(task);
      resolve(result);
      this.processQueue();
    } catch (error) {
      reject(error);
      this.processQueue();
    }
  }

  private processQueue() {
    const next = this.queue.shift();
    if (next) {
      const worker = this.getAvailableWorker();
      if (worker) {
        this.runTask(worker, next.task, next.resolve, next.reject);
      }
    }
  }
} 