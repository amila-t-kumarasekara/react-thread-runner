# React Thread Runner

A lightweight React library for running CPU-intensive tasks in Web Workers without blocking the main thread.

## Installation

```bash
npm install react-thread-runner
```

## Features

- 🚀 Run heavy computations in separate threads
- 🎯 Simple API with React hooks
- 🔄 Automatic worker pool management
- ⚡ Zero dependencies
- 📦 TypeScript support

## Usage

### Basic Example

```typescript
import { ThreadRunner } from 'react-thread-runner';

function MyComponent() {
  const handleHeavyTask = async () => {
    const runner = new ThreadRunner({ maxWorkers: 4 });
    
    try {
      const result = await runner.execute(() => {
        // Your CPU-intensive code here
        function fibonacci(n) {
          if (n <= 1) return n;
          return fibonacci(n - 1) + fibonacci(n - 2);
        }
        return fibonacci(40);
      });
      
      console.log('Result:', result);
    } catch (error) {
      console.error('Task failed:', error);
    }
  };

  return (
    <button onClick={handleHeavyTask}>
      Run Heavy Task
    </button>
  );
}
```

### Using the Hook

```typescript
import { useWorkerTask } from 'react-thread-runner';

function MyComponent() {
  const { runTask, isLoading, error } = useWorkerTask({ maxWorkers: 4 });

  const handleClick = async () => {
    try {
      const result = await runTask(() => {
        // Your CPU-intensive code here
        return heavyComputation();
      });
      console.log('Result:', result);
    } catch (err) {
      console.error('Task failed:', err);
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Computing...' : 'Start Task'}
      </button>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
```

## API Reference

### ThreadRunner

```typescript
const runner = new ThreadRunner(options);
```

#### Options

- `maxWorkers`: number (optional) - Maximum number of workers to spawn (defaults to number of CPU cores)

#### Methods

- `execute<T>(task: () => T | Promise<T>): Promise<T>` - Executes a task in a worker thread

### useWorkerTask Hook

```typescript
const { runTask, isLoading, error } = useWorkerTask(options);
```

#### Options

- `maxWorkers`: number (optional) - Maximum number of workers to spawn

#### Returns

- `runTask<T>(task: () => T | Promise<T>): Promise<T>` - Function to run a task
- `isLoading`: boolean - Loading state
- `error`: Error | null - Error state

## Examples

Check out the [examples](./examples) directory for more detailed examples:

- [Next.js Example](./examples/nextjs)

## Browser Support

Supports all modern browsers that implement the [Web Workers API](https://caniuse.com/webworkers).

## License

MIT © [Amila Kumarasekara](https://github.com/amila-t-kumarasekara)