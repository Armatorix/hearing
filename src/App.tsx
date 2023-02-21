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
      if (playing)
        setGain((g) => g + 10)
      // TODO: change to binary search 
      console.log("tick", gain, playing)
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
          console.log("pre", gain, playing)
          if (!playing) {
            setGain(0);
          }
          toggle();
          console.log("post", playing, gain)
        }}>Toggle</button>
      </header>
    </div >
  );
}

export default App;
