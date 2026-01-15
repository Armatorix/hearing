import { useState, useEffect } from 'react'
import './App.css'
import AudioSetup from './AudioSetup'
import Hearing from './Hearing'
import Results, { Datapoint, SavedResult, saveResult, getHistory, clearHistory, deleteResult, exportHistory, importHistory, calculateScore, getScoreInfo, getDevices } from './Results'

const FREQS = [
  2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000, 22000,
]
const SIDES = ['right', 'left'] as ('right' | 'left')[]

type Theme = 'light' | 'dark' | 'system'

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
)

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
)

const SystemIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
  </svg>
)

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme
    return saved || 'system'
  })

  useEffect(() => {
    const root = window.document.documentElement
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      const isDark = theme === 'dark' || (theme === 'system' && systemDark.matches)
      root.classList.toggle('dark', isDark)
    }

    applyTheme()
    localStorage.setItem('theme', theme)

    const handleChange = () => {
      if (theme === 'system') applyTheme()
    }

    systemDark.addEventListener('change', handleChange)
    return () => systemDark.removeEventListener('change', handleChange)
  }, [theme])

  return { theme, setTheme }
}

function ThemeToggle({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  const themes: Theme[] = ['light', 'dark', 'system']
  const icons = {
    light: <SunIcon />,
    dark: <MoonIcon />,
    system: <SystemIcon />,
  }

  return (
    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-lg p-1">
      {themes.map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`p-2 rounded-md transition-all duration-200 ${
            theme === t
              ? 'bg-white text-primary-600 shadow-md'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
          title={t.charAt(0).toUpperCase() + t.slice(1)}
        >
          {icons[t]}
        </button>
      ))}
    </div>
  )
}

type ViewMode = 'setup' | 'test' | 'results' | 'history' | 'view-result'

interface AppContentProps {
  onViewModeChange?: (mode: ViewMode) => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
}

function AppContent({ viewMode, setViewMode }: AppContentProps) {
  const [results, setResults] = useState([] as number[])
  const [history, setHistory] = useState<SavedResult[]>(() => getHistory())
  const [selectedResult, setSelectedResult] = useState<SavedResult | null>(null)
  const [currentResult, setCurrentResult] = useState<SavedResult | null>(null)
  const [audioLevel, setAudioLevel] = useState<number>(() => {
    const saved = localStorage.getItem('hearing-audio-level')
    return saved ? Number(saved) : 50
  })
  const [device, setDevice] = useState<string>(() => {
    const devices = getDevices()
    return devices.length === 1 ? devices[0] : ''
  })
  const availableDevices = getDevices()

  const refreshHistory = () => setHistory(getHistory())

  const freq =
    results.length >= FREQS.length
      ? FREQS[results.length - FREQS.length]
      : FREQS[results.length]
  const side = results.length >= FREQS.length ? SIDES[0] : SIDES[1]
  const progress = (100 * results.length) / (FREQS.length * SIDES.length)
  
  // When test is complete, save and show results
  useEffect(() => {
    if (results.length === FREQS.length * SIDES.length) {
      const data: Array<Datapoint> = []
      for (let i = 0; i < FREQS.length; i++) {
        data.push({
          name: FREQS[i],
          right: results[i],
          left: results[i + FREQS.length],
        })
      }
      const saved = saveResult(data, audioLevel, device || undefined)
      setCurrentResult(saved)
      setViewMode('results')
      refreshHistory()
    }
  }, [results, audioLevel, device])

  // View a selected historical result
  if (viewMode === 'view-result' && selectedResult) {
    return (
      <Results 
        data={selectedResult.data} 
        date={selectedResult.date}
        audioLevel={selectedResult.audioLevel}
        device={selectedResult.device}
        onBack={() => {
          setSelectedResult(null)
          setViewMode('history')
        }}
      />
    )
  }

  // Reset test when starting new test
  const handleNewTest = () => {
    setResults([])
    setCurrentResult(null)
    setViewMode('setup')
  }

  // Show current test results
  if (viewMode === 'results' && currentResult) {
    return (
      <Results data={currentResult.data} audioLevel={currentResult.audioLevel} device={currentResult.device} />
    )
  }

  // Show history
  if (viewMode === 'history') {
    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      
      try {
        const result = await importHistory(file)
        refreshHistory()
        alert(`✅ Import complete!\n\nImported: ${result.imported} results\nSkipped: ${result.skipped} (duplicates or invalid)`)
      } catch (err) {
        alert(`❌ Import failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
      
      // Reset input so same file can be selected again
      e.target.value = ''
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            📜 Test History
          </h2>
          <div className="flex flex-wrap gap-2">
            {history.length > 0 && (
              <button
                onClick={exportHistory}
                className="px-4 py-2 border-2 border-primary-500 dark:border-primary-400 text-primary-500 dark:text-primary-400 font-semibold rounded-lg hover:bg-primary-500 hover:text-white dark:hover:bg-primary-600 transition-all duration-200"
                title="Export all results to a JSON file"
              >
                📤 Export
              </button>
            )}
            <label className="px-4 py-2 border-2 border-primary-500 dark:border-primary-400 text-primary-500 dark:text-primary-400 font-semibold rounded-lg hover:bg-primary-500 hover:text-white dark:hover:bg-primary-600 transition-all duration-200 cursor-pointer">
              📥 Import
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            {history.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all history?')) {
                    clearHistory()
                    refreshHistory()
                  }
                }}
                className="px-4 py-2 border-2 border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200"
              >
                🗑️ Clear All
              </button>
            )}
          </div>
        </div>
        
        {history.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg">No test history yet.</p>
            <p className="text-sm mt-2">Complete a hearing test to see your results here.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {history.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <button
                  onClick={() => {
                    setSelectedResult(result)
                    setViewMode('view-result')
                  }}
                  className="flex-1 text-left"
                >
                  <div className="font-semibold text-gray-800 dark:text-gray-100">
                    {new Date(result.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{new Date(result.date).toLocaleTimeString()}</span>
                    {(() => {
                      const score = calculateScore(result.data)
                      const scoreInfo = getScoreInfo(score)
                      return (
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${scoreInfo.colorClass}`}>
                          🎯 {score}
                        </span>
                      )
                    })()}
                    {result.audioLevel !== undefined && (
                      <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded text-xs font-medium">
                        🔊 {result.audioLevel}%
                      </span>
                    )}
                    {result.device && (
                      <span className="px-2 py-0.5 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 rounded text-xs font-medium">
                        🎧 {result.device}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (window.confirm('Delete this result?')) {
                      deleteResult(result.id)
                      refreshHistory()
                    }
                  }}
                  className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Show audio setup screen
  if (viewMode === 'setup') {
    return (
      <AudioSetup
        audioLevel={audioLevel}
        setAudioLevel={setAudioLevel}
        device={device}
        setDevice={setDevice}
        availableDevices={availableDevices}
        onStart={() => setViewMode('test')}
      />
    )
  }

  // Show test in progress (skip if already complete)
  if (results.length === FREQS.length * SIDES.length) {
    return null // Will be handled by useEffect
  }
  
  return (
    <div className="space-y-6">
      {/* Current test settings summary */}
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full font-medium">
          🔊 Volume: {audioLevel}%
        </span>
        {device && (
          <span className="px-3 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 rounded-full font-medium">
            🎧 {device}
          </span>
        )}
        <button
          onClick={() => setViewMode('setup')}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          ⚙️ Settings
        </button>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to restart the hearing test? All current progress will be lost.')) {
              setResults([])
            }
          }}
          className="px-3 py-1 border border-red-400 dark:border-red-500 text-red-500 dark:text-red-400 rounded-full font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        >
          🔄 Restart
        </button>
      </div>

      <div className="progress-section space-y-2">
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-md font-semibold text-primary-600 dark:text-primary-400">
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
  const { theme, setTheme } = useTheme()
  const [viewMode, setViewMode] = useState<ViewMode>('setup')

  return (
    <div className="">
      <nav className="bg-gradient-to-r from-primary-500 to-secondary-500 dark:from-primary-700 dark:to-secondary-700 shadow-xl md:px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between gap-4">
          <div className='flex flex-row'>
          <h1 className="text-xl md:text-3xl font-bold text-white">
            🎧
          </h1>
          <h1 className="text-xl md:text-3xl font-bold text-white hidden md:block">
            Hearing Test
          </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setViewMode('setup')}
              className={`px-3 py-2 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                viewMode === 'setup' || viewMode === 'test' || viewMode === 'results'
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-white/90 hover:bg-white/20'
              }`}
            >
              🎯 New Test
            </button>
            <button
              onClick={() => setViewMode('history')}
              className={`px-3 py-2 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                viewMode === 'history' || viewMode === 'view-result'
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-white/90 hover:bg-white/20'
              }`}
            >
              📜 History
            </button>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </nav>
      <div className="container mx-auto max-w-xl md:px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-2 md:p-8 mt-8 mb-8 animate-slide-up transition-colors duration-300">
          <AppContent viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>
    </div>
  )
}

export default App
