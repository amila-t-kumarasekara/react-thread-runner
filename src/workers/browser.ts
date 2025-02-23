export class BrowserWorker {
    private worker: Worker;
    
    constructor(workerFunction: Function) {
      const blob = new Blob(
        [`(${workerFunction.toString()})()`],
        { type: 'application/javascript' }
      );
      this.worker = new Worker(URL.createObjectURL(blob));
    }
  
    async execute<T>(task: () => Promise<T>): Promise<T> {
      return new Promise((resolve, reject) => {
        this.worker.onmessage = (event) => {
          if (event.data.error) {
            reject(new Error(event.data.error));
          } else {
            resolve(event.data.result);
          }
        };
  
        this.worker.onerror = (error) => {
          reject(error);
        };
  
        this.worker.postMessage({ task: task.toString() });
      });
    }
  
    terminate() {
      this.worker.terminate();
    }
  }