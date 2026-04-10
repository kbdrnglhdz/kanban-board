import React from 'react';
import Board from './components/Board';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>Tablero Kanban</h1>
      <Board />
    </div>
  );
}

export default App;