// Signup.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleFileChange = (e) => {
    console.log('Selected file:', e.target.files[0]);
  };

  // Handle signup logic
  const handleSignup = async () => {
    try {
      // Make an API call to register the new user
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      if (response.ok) {
        // Registration successful, handle any additional logic

        // For example, you might want to redirect the user to the login page
        console.log('User registered successfully');
      } else {
        // Registration failed, handle error
        console.error('User registration failed');
      }
    } catch (error) {
      console.error('Error during user registration:', error);
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form>
        <label className="signup-label">Name:</label>
        <input type="text" className="signup-input" value={name} onChange={(e) => setName(e.target.value)} placeholder='fullname' />
        <br />
        <label className="signup-label">Email:</label>
        <input type="text" className="signup-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='exam@gmail.com'/>
        <br />
        <label className="signup-label">Password:</label>
        <input type="password" className="signup-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password' />
        <br />
        <label className="signup-label">Confirm Password:</label>
        <input
          type="password"
          className="signup-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder='confirmpassword'
        />
        <br />
        <input type="file" className="signup-file-input" onChange={handleFileChange} />
        <br />
        <button type="button" className="signup-button" > 
        <Link to="/userlist" className="signup_links" onClick={handleSignup}>
          Signup</Link>
        </button>
      </form>
    </div>
  );
};

export default Signup;
