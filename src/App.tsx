import { useState } from 'react'
import './App.css'
import Hearing from './Hearing'
import Results, { Datapoint } from './Results'

const FREQS = [
  2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000, 22000,
]
const SIDES = ['right', 'left'] as ('right' | 'left')[]

function AppContent() {
  const [results, setResults] = useState([] as number[])

  const freq =
    results.length >= FREQS.length
      ? FREQS[results.length - FREQS.length]
      : FREQS[results.length]
  const side = results.length >= FREQS.length ? SIDES[0] : SIDES[1]
  const progress = (100 * results.length) / (FREQS.length * SIDES.length)
  
  if (results.length === FREQS.length * SIDES.length) {
    console.log(results)
    const data: Array<Datapoint> = []
    for (let i = 0; i < FREQS.length; i++) {
      data.push({
        name: FREQS[i],
        right: results[i],
        left: results[i + FREQS.length],
      })
    }
    return <Results data={data} />
  }
  
  return (
    <div className="space-y-6">
      <div className="progress-section space-y-2">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-lg font-semibold text-primary-600">
          {`${Math.round(progress)}% Complete`}
        </p>
      </div>
      <div className="hearing-container">
        <Hearing
          freq={freq}
          side={side}
          submit={(v: number) => {
            setResults((old) => [...old, v])
          }}
        />
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="min-h-screen">
      <nav className="bg-gradient-to-r from-primary-500 to-secondary-500 shadow-xl px-6 py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          🎧 Hearing Monitor
        </h1>
      </nav>
      <div className="container mx-auto max-w-4xl px-4">
        <div className="app-container">
          <AppContent />
        </div>
      </div>
    </div>
  )
}

export default App
