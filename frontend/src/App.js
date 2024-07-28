import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';

// Components
import Home from './pages/Home';
import LoginFormComponent from './pages/Login'; 
import ShowQRCode from './pages/QRCode'; 
import ShowResearch from './pages/Research'; 
import ShowHistoryLogin from './pages/HistoryLogin'; 

function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginFormComponent />} />
          <Route path="/loginqr" element={<ShowQRCode />} />
          <Route path="/research" element={<ShowResearch />} />
          <Route path="/history" element={<ShowHistoryLogin />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;