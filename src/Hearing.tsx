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
    <Stack spacing={5} paddingTop={'2em'}>
      <Typography variant="h5">
        Ear: {props.side} Frequency: {props.freq} Hz{' '}
      </Typography>
      <Typography>
        Adjust slider till you{' '}
        <a
          href="https://img-9gag-fun.9cache.com/photo/ayL83Ly_700bwp.webp"
          target="_blank"
        >
          bearly
        </a>{' '}
        hear the noice.
      </Typography>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <VolumeDown />
        <Slider
          aria-label="Volume"
          min={0}
          max={100}
          step={1}
          value={gain}
          valueLabelDisplay="on"
          onChange={(_: Event, newValue: number | number[]) => {
            start()
            setGain(newValue as number)
          }}
        />
        <VolumeUp />
      </Stack>
      <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
        <VolumeDown />
        {[-1, -5, -10, +1, +5, 10].map((v) => (
          <Button
            key={v + '-set-volume-btn'}
            variant="outlined"
            onClick={() => {
              start()
              console.log(gain)
              setGain((old) => Math.max(0, Math.min(100, old + v)))
            }}
          >
            {v > 0 ? '+' + v : v}
          </Button>
        ))}
        <VolumeUp />
      </Stack>
      <Button variant="outlined" onClick={() => {}}>
        Next
      </Button>
    </Stack>
  )
}
export default Hearing
