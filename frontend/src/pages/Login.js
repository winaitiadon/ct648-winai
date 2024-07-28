import React, { useState, useEffect } from 'react';
import './SlideNavbar.css'; 

const BACKEND_SERVER = process.env.REACT_APP_BACKEND_SERVER;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // const checkToken = sessionStorage.getItem('token');
    const checkToken = localStorage.getItem('token');
    if (checkToken) {
      window.location.href = '/';
    }
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(BACKEND_SERVER + "login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Handle successful login response
      const jsonData = await response.json();
      if(jsonData.message === 'Invalid credentials'){
        throw new Error(`Invalid credentials`);
        console.log('test');
      }

      console.log('Login successful:', jsonData);
      // Save token to session storage
      // sessionStorage.setItem('token', jsonData.token);
      localStorage.setItem('token', jsonData.token);

      // Redirect to '/'
      window.location.href = '/';
      
      // Redirect or handle success as needed
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid credentials'); // or set error message based on response
    }
  };

  return (
    <div className="main">
      <div className="login">
        <form onSubmit={handleSubmit}>
          <label htmlFor="chk" aria-hidden="true">Login</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            name="pswd"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <a href="/loginqr"> Login QR Code</a>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

const LoginFormComponent = () => {
  return (
    <div className="App">
      <h1>Login Page</h1>
      <Login />
    </div>
  );
};

export default LoginFormComponent;
