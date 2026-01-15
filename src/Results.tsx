import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Datapoint = {
  name: number
  right: number
  left: number
}

export type SavedResult = {
  id: string
  date: string
  data: Datapoint[]
  audioLevel?: number
}

// Calculate a hearing score from 0-100 (higher is better)
// Based on average sensitivity across all frequencies and ears
// Lower volume needed = better hearing = higher score
export const calculateScore = (data: Datapoint[]): number => {
  if (!data || data.length === 0) return 0
  
  const allValues = data.flatMap(d => [d.right, d.left])
  const avgVolume = allValues.reduce((sum, v) => sum + v, 0) / allValues.length
  
  // Invert: 0% volume needed = 100 score, 100% volume needed = 0 score
  return Math.round(100 - avgVolume)
}

// Get score label and color based on score value
export const getScoreInfo = (score: number): { label: string; colorClass: string } => {
  if (score >= 90) return { label: 'Excellent', colorClass: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' }
  if (score >= 75) return { label: 'Good', colorClass: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30' }
  if (score >= 60) return { label: 'Fair', colorClass: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30' }
  if (score >= 40) return { label: 'Below Average', colorClass: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30' }
  return { label: 'Poor', colorClass: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30' }
}

const STORAGE_KEY = 'hearing-test-history'

export const saveResult = (data: Datapoint[], audioLevel?: number): SavedResult => {
  const result: SavedResult = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    data,
    audioLevel,
  }
  const history = getHistory()
  history.unshift(result)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  return result
}

export const getHistory = (): SavedResult[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}

export const deleteResult = (id: string): void => {
  const history = getHistory().filter(r => r.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export const exportHistory = (): void => {
  const history = getHistory()
  const data = JSON.stringify(history, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `hearing-test-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const importHistory = (file: File): Promise<{ imported: number; skipped: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const imported = JSON.parse(content) as SavedResult[]
        
        if (!Array.isArray(imported)) {
          throw new Error('Invalid backup file format')
        }
        
        const currentHistory = getHistory()
        const existingIds = new Set(currentHistory.map(r => r.id))
        
        let importedCount = 0
        let skippedCount = 0
        
        for (const result of imported) {
          if (!result.id || !result.date || !result.data) {
            skippedCount++
            continue
          }
          if (existingIds.has(result.id)) {
            skippedCount++
            continue
          }
          currentHistory.push(result)
          importedCount++
        }
        
        // Sort by date descending
        currentHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentHistory))
        
        resolve({ imported: importedCount, skipped: skippedCount })
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

const HelpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
)

const Results = (props: { data: Datapoint[]; date?: string; audioLevel?: number; onBack?: () => void }) => {
  const { innerHeight: height } = window
  const score = calculateScore(props.data)
  const scoreInfo = getScoreInfo(score)
  
  return (
    <div className="results-container space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        {props.onBack && (
          <button
            onClick={props.onBack}
            className="p-2 text-primary-500 dark:text-primary-400 hover:text-secondary-500 dark:hover:text-secondary-400 transition-colors"
            title="Back to history"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
        )}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          📊 {props.date ? 'Past Results' : 'Your Results'}
        </h2>
        {props.date && (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(props.date).toLocaleString()}
          </span>
        )}
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${scoreInfo.colorClass}`}>
          🎯 Score: {score} ({scoreInfo.label})
        </span>
        {props.audioLevel !== undefined && (
          <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold">
            🔊 System Volume: {props.audioLevel}%
          </span>
        )}
        <div className="group relative">
          <button className="p-1 text-primary-500 dark:text-primary-400 hover:text-secondary-500 dark:hover:text-secondary-400 transition-colors">
            <HelpIcon />
          </button>
          <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-gray-800 dark:bg-gray-900 text-white text-sm rounded-lg 
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-xl">
            Lower values are better - they indicate less volume was needed for you to hear the sound.
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300">
        Your hearing sensitivity across different frequencies. The chart shows how much volume was required for each frequency.
      </p>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={height / 2}>
          <LineChart data={props.data}>
            <XAxis 
              dataKey="name" 
              unit="Hz" 
              name="Frequency"
              style={{ fontSize: '14px', fontWeight: 600 }}
            />
            <YAxis 
              unit="%" 
              reversed
              style={{ fontSize: '14px', fontWeight: 600 }}
            />
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
            <ChartTooltip 
              contentStyle={{
                backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#1f2937',
                border: '2px solid #667eea',
                borderRadius: '8px',
                fontWeight: 600,
              }}
            />
            <Legend 
              wrapperStyle={{ fontWeight: 600 }}
            />
            <Line 
              type="monotone" 
              dataKey="right" 
              stroke="#667eea" 
              strokeWidth={3}
              name="Right Ear"
              dot={{ fill: '#667eea', r: 5 }}
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="left" 
              stroke="#f5576c" 
              strokeWidth={3}
              name="Left Ear"
              dot={{ fill: '#f5576c', r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Results
export type { Datapoint }
