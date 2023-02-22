import { AppBar, Container, Switch, Toolbar, Typography } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useState } from 'react'
import './App.css'
import Hearing from './Hearing'

function App() {
  const [side, setSide] = useState('left' as 'left' | 'right')
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4">Hearing monitor</Typography>
        </Toolbar>
      </AppBar>
      <Container className="App" maxWidth="sm">
        <FormControlLabel
          value={side}
          control={<Switch color="primary" />}
          label={side}
          labelPlacement="bottom"
          onClick={() => {
            setSide((old) => (old === 'left' ? 'right' : 'left'))
          }}
        />
        <Hearing freq={7137} side={side} />
      </Container>
    </>
  )
}

export default App
