import {
  AppBar,
  Box,
  Container,
  LinearProgress,
  Toolbar,
  Typography,
} from '@mui/material'
import { Stack } from '@mui/system'
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
  const buffer = 100 / (FREQS.length * SIDES.length)
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
    <Stack>
      <Stack>
        <LinearProgress
          variant="buffer"
          value={progress}
          valueBuffer={progress + buffer}
        />

        <Typography variant="body2" color="text.secondary">{`${Math.round(
          progress
        )}%`}</Typography>
      </Stack>
      <Hearing
        freq={freq}
        side={side}
        submit={(v: number) => {
          setResults((old) => [...old, v])
        }}
      />
    </Stack>
  )
}
function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4">Hearing monitor</Typography>
        </Toolbar>
      </AppBar>
      <Container className="App" maxWidth="md">
        <Box paddingTop={'2em'}>
          <AppContent />
        </Box>
      </Container>
    </>
  )
}

export default App
