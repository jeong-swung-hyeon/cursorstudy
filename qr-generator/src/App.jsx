import { useState } from 'react'
import QRGenerator from './components/QRGenerator'
import './App.css'

function App() {
  return (
    <div className="app">
      <div className="container">
        <h1 className="title">QR 코드 생성기</h1>
        <QRGenerator />
      </div>
    </div>
  )
}

export default App
