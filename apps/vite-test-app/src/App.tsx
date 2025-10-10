import { useEffect, useState } from "react";

import reactLogo from "./assets/react.svg";

// this proves that import-x plugin is enabled
// eslint-disable-next-line import-x/no-absolute-path
import viteLogo from "/vite.svg";

import "./App.css";

const App = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // this proves that the new react-hooks rules work
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCount((count) => count + 1);
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" rel="noopener" target="_blank">
          <img alt="Vite logo" className="logo" src={viteLogo} />
        </a>
        <a href="https://react.dev" rel="noopener" target="_blank">
          <img alt="React logo" className="logo react" src={reactLogo} />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {/* This proves that react plugin is enabled */}
        {/* eslint-disable-next-line react/button-has-type */}
        <button
          onClick={() => {
            setCount((count) => count + 1);
          }}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
};

export default App;
