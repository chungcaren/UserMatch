import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [location, setLocation] = useState(null);

  function getLocation () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
  }
    
  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocation({ latitude, longitude });
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  return (
    <div className="location-button">
      <button onclick={getLocation}>Allow Location</button>
    </div>
  );
  
}

export default App;
