import React, { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    // Perform validation or send the username and password to the server for verification
    // For now, we'll just check if the username is 'user' and password is 'password'
    if (username === 'user' && password === 'password') {
      setMessage('Login successful');
    } else if (username === 'user') {
      setMessage('Incorrect password. Reset password?');
    } else {
      setMessage('Username not found');
    }
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
    </div>
  );
}

export default App;
