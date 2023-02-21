import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Frequency, useFrequency } from 'react-frequency';

function App() {
  const { toggle, start, stop, playing } = useFrequency({
    hz: 2137
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={() => {
          playing ? stop() : start();
        }}>Toggle</button>
      </header>
    </div >
  );
}

export default App;
