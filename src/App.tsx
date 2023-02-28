import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import { useState } from 'react'
import './App.css'
import Hearing from './Hearing'

const FREQS = [
  2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000, 22000,
]
const SIDES = ['right', 'left'] as ('right' | 'left')[]

function App() {
  const [results, setResults] = useState([] as number[])

  const freq =
    results.length >= FREQS.length
      ? FREQS[results.length - FREQS.length]
      : FREQS[results.length]
  const side = results.length >= FREQS.length ? SIDES[0] : SIDES[1]
  if (results.length === FREQS.length * SIDES.length) {
    console.log(results)
    return <Button>XD</Button>
  }
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4">Hearing monitor</Typography>
        </Toolbar>
      </AppBar>
      <Container className="App" maxWidth="md">
        <Hearing
          freq={freq}
          side={side}
          submit={(v: number) => {
            setResults((old) => [...old, v])
          }}
        />
      </Container>
    </>
  )
}

export default App
