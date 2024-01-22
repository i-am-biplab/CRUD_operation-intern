// Signup.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const Signup = () => {
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
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
      const response = await fetch('http://127.0.0.1:8000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fname, lname, email, password, confirmPassword }),
      });

      if (response.ok) {
        // Registration successful, handle any additional logic

        // For example, you might want to redirect the user to the login page
        console.log('User registered successfully');
        redirectToUserListPage();
      } else {
        // Registration failed, handle error
        console.error('User registration failed');
      }
    } catch (error) {
      console.error('Error during user registration:', error);
    }
  };

  const redirectToUserListPage = () => {
    window.location.href = '/userList';
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form>
        <label className="signup-label">FirstName:</label>
        <input type="text" className="signup-input" value={fname} onChange={(e) => setFName(e.target.value)} placeholder='firstname' />
        <br />
        <label className="signup-label">LastName:</label>
        <input type="text" className="signup-input" value={lname} onChange={(e) => setLName(e.target.value)} placeholder='lastname' />
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
        
        <button type="button" className="signup-button" onClick={handleSignup}> 
        <span className="signup_links">Signup</span>
        </button>
      </form>
    </div>
  );
};

export default Signup;
