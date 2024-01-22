import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Cookies from 'js-cookie';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Make an API call to authenticate the user
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Set a cookie upon successful login
        console.log("login successfull");
        const data = await response.json();
        console.log('Setting authToken cookie:', data.authToken);
        Cookies.set('authToken', data.authToken);
        window.location.href = '/userList';
        


        // Add any other necessary logic for successful login
        // console.log('Logged in successfully');
      } else {
        // Handle authentication failure
        console.error('Login failed');
        alert('wrong credential...');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };



  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="input-container">
        <label>Email:</label>
        <input
          type="email"
          placeholder="exam@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-container">
        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
      <div className="forgot-password-link">
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>
      <div className="signup-link">
        Don't have an account? <Link to="/signup">Create an Account</Link>
      </div>
    </div>
  );
};


export default Login;
