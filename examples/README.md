# React Thread Runner Examples

This directory contains example applications demonstrating the usage of react-thread-runner in different frameworks and scenarios.

## Available Examples

### Next.js Example

A simple Next.js application that demonstrates how to use react-thread-runner to perform heavy computations without blocking the main thread.

To run the Next.js example:

1. Navigate to the example directory:
   ```bash
   cd examples/nextjs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

The example demonstrates:
- Running computationally intensive tasks in separate threads
- Handling loading states
- Displaying results
- Error handling 