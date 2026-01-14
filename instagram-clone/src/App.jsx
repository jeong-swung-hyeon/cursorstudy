import React from 'react'
import Feed from './components/Feed'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="logo">Instagram</h1>
        </div>
      </header>
      <main className="main-content">
        <Feed />
      </main>
    </div>
  )
}

export default App
