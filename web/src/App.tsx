import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Auth } from './components/Auth';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      {/* Temporarily put the Auth component here to check it works */}
      <Auth></Auth>
    </div>
  );
}

export default App;
