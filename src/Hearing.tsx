import Button from '@mui/material/Button'
import { useEffect, useState } from 'react'
import { useFrequency } from 'react-frequency'

const Hearing = (props: { freq: number; side: 'right' | 'left' }) => {
  const [gain, setGain] = useState(0)
  const { toggle } = useFrequency({
    hz: props.freq,
    type: props.side,
    oscillator: 'sine',
    gain: gain / 100,
  })

  useEffect(() => {
    const id = setInterval(() => {
      setGain((g) => Math.min(g + 10, 100))
    }, 1000)

    return () => {
      clearInterval(id)
    }
  }, [])
  return (
    <Button
      onClick={() => {
        setGain(0)
        setTimeout(() => {
          toggle()
        }, 150)
      }}
    >
      I hear!
    </Button>
  )
}
export default Hearing
