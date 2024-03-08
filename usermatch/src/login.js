import React, { useState } from 'react';
import './App.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    const message =
      username === 'user' && password === 'password'
        ? 'Login successful'
        : username === 'user'
        ? 'Incorrect password. Reset password?'
        : 'Username not found';
    setMessage(message);
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
      <button onClick={handleLogin}>Login</button>
      <div>{message}</div>
      {message === 'Incorrect password. Reset password?' && (
        <button onClick={handleResetPassword}>Reset Password</button>
      )}
    </div>
  );
}

export default Login;
