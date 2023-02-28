import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { useState } from 'react'
import './App.css'
import Hearing from './Hearing'

function App() {
  const [side, setSide] = useState('right' as 'left' | 'right')
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4">Hearing monitor</Typography>
        </Toolbar>
      </AppBar>
      <Container className="App" maxWidth="md">
        <Hearing freq={7137} side={side} submit={() => {}} />
      </Container>
    </>
  )
}

export default App
