import React from 'react'
import { ThreadRunner } from 'react-thread-runner'

export default function Home() {
  const [result, setResult] = React.useState<number | null>(null)
  const [loading, setLoading] = React.useState(false)

  const handleCompute = async () => {
    setLoading(true)
    
    const runner = new ThreadRunner({ maxWorkers: 4 })
    
    try {
      const result = await runner.execute(() => {
        function fibonacci(n: number): number {
          if (n <= 1) return n;
          return fibonacci(n - 1) + fibonacci(n - 2);
        }
        return fibonacci(40);
      });
      setResult(result);
    } catch (error) {
      console.error('Computation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">
        React Thread Runner - Next.js Example
      </h1>
      
      <button
        onClick={handleCompute}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {loading ? 'Computing...' : 'Compute Fibonacci(40)'}
      </button>

      {result !== null && (
        <div className="mt-4">
          <h2 className="text-xl">Result:</h2>
          <p className="text-lg">{result}</p>
        </div>
      )}
    </main>
  )
}
