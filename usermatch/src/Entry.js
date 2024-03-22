import React, { useState } from 'react';
import './App.css';

function Entry({ handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLoginClick = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', { // Replace with your login API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        handleLogin(username); // Call the handleLogin function passed from the parent component
        setMessage('Login successful');
      } else {
        setMessage('Username not found');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('Error logging in');
    }
  };

  const handleResetPassword = () => {
    // Implement the logic to reset the password
    setMessage('Password reset link sent to your email');
  };

  return (
    <div className="app">
      <h1>Login</h1>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLoginClick}>Login</button>
      <div>{message}</div>
      {message === 'Username not found' && (
        <button onClick={handleResetPassword}>Reset Password</button>
      )}
    </div>
  );
}

export default Entry;
