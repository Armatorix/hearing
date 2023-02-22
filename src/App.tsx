import { Switch } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useState } from 'react'
import './App.css'
import Hearing from './Hearing'

function App() {
  const [side, setSide] = useState('left' as 'left' | 'right')
  return (
    <div className="App">
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
    </div>
  )
}

export default App
