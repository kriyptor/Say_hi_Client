import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from './components/Auth.jsx'
import ChatApp from './components/ChatApp.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    try {
      setToken(token);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
    } catch (error) {
      console.log('Login error:', error); 
    }
  }

  const handleLogout = () => {
    try {
      console.log(`clicked`)
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
    } catch (error) {
      console.log('Logout error:', error); 
    }
  }


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <ChatApp handleLogout={handleLogout} /> : 
            <Auth 
            handleLogin={handleLogin} 
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
