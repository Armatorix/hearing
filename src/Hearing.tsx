import VolumeDown from '@mui/icons-material/VolumeDown'
import VolumeUp from '@mui/icons-material/VolumeUp'
import { Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Slider from '@mui/material/Slider'
import { Stack } from '@mui/system'
import { useState } from 'react'
import { useFrequency } from 'react-frequency'

const Hearing = (props: {
  freq: number
  side: 'right' | 'left'
  submit: (value: number) => void
}) => {
  const [gain, setGain] = useState(0)
  const { toggle, start } = useFrequency({
    hz: props.freq,
    type: props.side,
    oscillator: 'sine',
    gain: gain / 100,
  })

  // over time increment
  // useEffect(() => {
  //   const id = setInterval(() => {
  //     setGain((g) => Math.min(g + 5, 100))
  //   }, 1000)

  //   return () => {
  //     clearInterval(id)
  //   }
  // }, [])
  return (
    <Stack spacing={4}>
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
          Testing:
        </Typography>
        <span className="ear-badge">
          {props.side.toUpperCase()} EAR
        </span>
        <span className="frequency-badge">
          {props.freq} Hz
        </span>
      </Stack>
      <Typography variant="body1" sx={{ color: '#555', fontSize: '1.1rem' }}>
        Adjust the slider until you{' '}
        <a
          href="https://img-9gag-fun.9cache.com/photo/ayL83Ly_700bwp.webp"
          target="_blank"
          rel="noopener noreferrer"
        >
          bearly
        </a>{' '}
        hear the sound.
      </Typography>
      <Stack spacing={2} direction="row" sx={{ mb: 2, mt: 2 }} alignItems="center">
        <VolumeDown sx={{ color: '#667eea', fontSize: 32 }} />
        <Slider
          aria-label="Volume"
          min={0}
          max={100}
          step={1}
          value={gain}
          valueLabelDisplay="on"
          sx={{
            '& .MuiSlider-valueLabel': {
              backgroundColor: '#667eea',
              fontWeight: 600,
            },
          }}
          onChange={(_: Event, newValue: number | number[]) => {
            start()
            setGain(newValue as number)
          }}
        />
        <VolumeUp sx={{ color: '#764ba2', fontSize: 32 }} />
      </Stack>
      <Stack spacing={2} direction="row" sx={{ mb: 2 }} alignItems="center" flexWrap="wrap">
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', width: '100%' }}>
          Fine tune:
        </Typography>
        {[-10, -5, -1, +1, +5, 10].map((v) => (
          <Button
            key={v + '-set-volume-btn'}
            variant="outlined"
            size="small"
            sx={{
              borderColor: '#667eea',
              color: '#667eea',
              minWidth: '60px',
              '&:hover': {
                borderColor: '#764ba2',
                backgroundColor: 'rgba(102, 126, 234, 0.08)',
              },
            }}
            onClick={() => {
              start()
              console.log(gain)
              setGain((old) => Math.max(0, Math.min(100, old + v)))
            }}
          >
            {v > 0 ? '+' + v : v}
          </Button>
        ))}
      </Stack>
      <Button
        variant="contained"
        size="large"
        fullWidth
        sx={{
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontWeight: 600,
          padding: '12px',
          fontSize: '1.1rem',
          '&:hover': {
            backgroundImage: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
          },
        }}
        onClick={() => {
          props.submit(gain)
          setGain(0)
        }}
      >
        Next →
      </Button>
    </Stack>
  )
}
export default Hearing
