import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useFrequency } from 'react-frequency';


function App() {
  const [gain, setGain] = useState(0);
  const { toggle, playing } = useFrequency({
    hz: 2137,
    type: "right",
    oscillator: "sine",
    gain: gain / 100,
  });

  useEffect(() => {
    const id = setInterval(() => {
      // TODO: binary search
      setGain((g) => g + 10)
    }, 1000
    );

    return () => {
      clearInterval(id);
    };
  }, []);
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
          setGain(0);
          setTimeout(() => {
            toggle();
          }, 150)
        }}>Toggle</button>
      </header>
    </div >
  );
}

export default App;
