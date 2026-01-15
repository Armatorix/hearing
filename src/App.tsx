import { useState, useEffect } from 'react'
import './App.css'
import Hearing from './Hearing'
import Results, { Datapoint } from './Results'

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
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
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

  return (
    <div className="min-h-screen">
      <nav className="bg-gradient-to-r from-primary-500 to-secondary-500 dark:from-primary-700 dark:to-secondary-700 shadow-xl px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            🎧 Hearing Monitor
          </h1>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
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
