import { useState, useEffect, useRef } from 'react'

interface AudioSetupProps {
  audioLevel: number
  setAudioLevel: (level: number) => void
  device: string
  setDevice: (device: string) => void
  availableDevices: string[]
  onStart: () => void
}

const AudioSetup = ({
  audioLevel,
  setAudioLevel,
  device,
  setDevice,
  availableDevices,
  onStart,
}: AudioSetupProps) => {
  const [showDeviceSuggestions, setShowDeviceSuggestions] = useState(false)
  const [isTestingAudio, setIsTestingAudio] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const testOscillatorRef = useRef<OscillatorNode | null>(null)
  const testGainRef = useRef<GainNode | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (testOscillatorRef.current) {
        testOscillatorRef.current.stop()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const playTestTone = () => {
    if (isTestingAudio) {
      // Stop the test tone
      if (testOscillatorRef.current) {
        testOscillatorRef.current.stop()
        testOscillatorRef.current = null
      }
      if (testGainRef.current) {
        testGainRef.current = null
      }
      setIsTestingAudio(false)
      return
    }

    // Play a test tone
    const ctx = audioContextRef.current || new AudioContext()
    if (!audioContextRef.current) {
      audioContextRef.current = ctx
    }

    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime)
    gainNode.gain.setValueAtTime((audioLevel / 100) * 0.3, ctx.currentTime)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start()
    testOscillatorRef.current = oscillator
    testGainRef.current = gainNode
    setIsTestingAudio(true)

    // Auto stop after 2 seconds
    setTimeout(() => {
      if (testOscillatorRef.current) {
        testOscillatorRef.current.stop()
        testOscillatorRef.current = null
        testGainRef.current = null
        setIsTestingAudio(false)
      }
    }, 2000)
  }

  // Update test tone volume when audioLevel changes
  useEffect(() => {
    if (testGainRef.current && audioContextRef.current) {
      testGainRef.current.gain.setValueAtTime(
        (audioLevel / 100) * 0.3,
        audioContextRef.current.currentTime
      )
    }
  }, [audioLevel])


  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          🎛️ Audio Setup
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your audio settings before starting the hearing test
        </p>
      </div>

      {/* System Audio Level */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔊</span>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            System Audio Level
          </h3>
          <span className="ml-auto px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold">
            {audioLevel}%
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Set your system/device volume level. This is recorded with your test results for comparison.
        </p>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={audioLevel}
          onChange={(e) => {
            const value = Number(e.target.value)
            setAudioLevel(value)
            localStorage.setItem('hearing-audio-level', value.toString())
          }}
          className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
        <button
          onClick={playTestTone}
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            isTestingAudio
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50'
          }`}
        >
          {isTestingAudio ? '🔇 Stop Test Tone' : '🔈 Play Test Tone (1000 Hz)'}
        </button>
      </div>

      {/* Device Name Input */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎧</span>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">
            Test Device Name
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter the device you're using for this test (e.g., headphones model, earbuds, speakers).
        </p>
        <div className="relative">
          <input
            type="text"
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            onFocus={() => setShowDeviceSuggestions(true)}
            onBlur={() => setTimeout(() => setShowDeviceSuggestions(false), 150)}
            placeholder="Enter device name..."
            className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:border-primary-500 dark:focus:border-primary-400 focus:outline-none transition-colors"
          />
          {showDeviceSuggestions && availableDevices.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {availableDevices
                .filter((d) => d.toLowerCase().includes(device.toLowerCase()))
                .map((d) => (
                  <button
                    key={d}
                    type="button"
                    className="w-full px-4 py-2 text-left text-gray-800 dark:text-gray-100 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                    onMouseDown={() => setDevice(d)}
                  >
                    {d}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Start Test Button */}
      <button
        onClick={onStart}
        className="w-full py-4 px-6 bg-gradient-to-r from-primary-500 to-secondary-500 
                   text-white text-xl font-bold rounded-lg shadow-lg
                   hover:shadow-xl hover:scale-[1.02] transition-all duration-200
                   active:scale-[0.98]"
      >
        🎧 Start Hearing Test →
      </button>
    </div>
  )
}

export default AudioSetup
