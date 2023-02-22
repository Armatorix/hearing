import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useFrequency } from 'react-frequency';
import Hearing from './Hearing';


function App() {
  return (
    <div className="App">
      <Hearing freq={2137} />
    </div >
  );
}

export default App;
