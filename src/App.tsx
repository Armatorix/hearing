import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useFrequency } from 'react-frequency';
import Hearing from './Hearing';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Switch } from '@mui/material';


function App() {
  const [side, setSide] = useState("left" as "left" | "right")
  return (
    <div className="App">
      <FormControlLabel
        value={side}
        control={<Switch color="primary" />}
        label={side}
        labelPlacement="bottom"
        onClick={() => {
          setSide((old) => old == "left" ? "right" : "left")
        }}
      />
      <Hearing
        freq={7137}
        side={side}
      />
    </div >
  );
}

export default App;
