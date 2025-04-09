import { useState } from 'react'
import NetflixLogin from './components/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard'
function App() {
  const [count, setCount] = useState(0)

  return (
    
    <Router>
    <Routes>
  <Route path="/" element={<NetflixLogin />} />
  <Route path="/login" element={<NetflixLogin />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
</Routes>
  </Router>
);
}

export default App
