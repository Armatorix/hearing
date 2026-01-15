import { useState } from 'react'
import { useFrequency } from 'react-frequency'

const VolumeDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
)

const VolumeUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-secondary-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
  </svg>
)

const Hearing = (props: {
  freq: number
  side: 'right' | 'left'
  submit: (value: number) => void
}) => {
  const [gain, setGain] = useState(0)
  const { start } = useFrequency({
    hz: props.freq,
    type: props.side,
    oscillator: 'sine',
    gain: gain / 100,
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-semibold text-gray-800">
          Testing:
        </h2>
        <span className="ear-badge">
          {props.side.toUpperCase()} EAR
        </span>
        <span className="frequency-badge">
          {props.freq} Hz
        </span>
      </div>
      
      <p className="text-gray-600 text-lg">
        Adjust the slider until you{' '}
        <a
          href="https://img-9gag-fun.9cache.com/photo/ayL83Ly_700bwp.webp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-500 hover:text-secondary-500 font-semibold underline"
        >
          bearly
        </a>{' '}
        hear the sound.
      </p>

      <div className="flex items-center gap-4 mt-8 mb-8">
        <VolumeDownIcon />
        <div className="flex-1 relative pt-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            {gain}%
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={gain}
            onChange={(e) => {
              start()
              setGain(Number(e.target.value))
            }}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
        </div>
        <VolumeUpIcon />
      </div>

      <div className="space-y-3">
        <p className="font-semibold text-gray-600">
          Fine tune:
        </p>
        <div className="flex flex-wrap gap-2">
          {[-10, -5, -1, +1, +5, 10].map((v) => (
            <button
              key={v + '-set-volume-btn'}
              className="px-4 py-2 border-2 border-primary-500 text-primary-500 rounded-lg font-semibold 
                         hover:bg-primary-500 hover:text-white transition-all duration-200 
                         hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              onClick={() => {
                start()
                setGain((old) => Math.max(0, Math.min(100, old + v)))
              }}
            >
              {v > 0 ? '+' + v : v}
            </button>
          ))}
        </div>
      </div>

      <button
        className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-primary-500 to-secondary-500 
                   text-white text-lg font-semibold rounded-lg shadow-lg
                   hover:shadow-xl hover:scale-[1.02] transition-all duration-200
                   active:scale-[0.98]"
        onClick={() => {
          props.submit(gain)
          setGain(0)
        }}
      >
        Next →
      </button>
    </div>
  )
}

export default Hearing
