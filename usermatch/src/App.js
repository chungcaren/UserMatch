import React, { useState, useRef } from 'react';
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
    
    fetch('http://localhost:3000/updateLocation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: latitude,
        longitude: longitude,
      }),
    }).catch((error) => console.error("Error fetching location: ", error));
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  return (
    <main className="app-main">
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <div className="location-button">
          <button onClick={getLocation}>Allow Location</button>
        </div>
      </div>
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <header>Fill out your user profile!</header>
      </div>
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <div className="user-profile">
          <ProfileInput/>
        </div>
      </div>
    </main>
  );
}

function ProfileInput() {
  const form = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);

    const username = formData.get('username');
    const password = formData.get('password');
    const name = formData.get('name');
    const age = formData.get('age');
    const interests = formData.get('interests');
    const travel_spots = formData.get('travel_spots');
    const hobbies = formData.get('hobbies');
    const working_out = formData.get('working_out');


    // food,travel,studying transforms into: ['food', 'travel', studying]
    const interests_array = interests.split(',');
    const travel_spots_array = travel_spots.split(',');
    const hobbies_array = hobbies.split(',');
    let working_out_boolean = false;
    if (working_out === 'yes'){
      working_out_boolean = true;
    }

    fetch('http://localhost:3000/userprofile', { 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json', 
      }, 
      body: JSON.stringify({
        username: username,
        password: password,
        name: name,
        age: age,
        interests: interests_array,
        travel_spots: travel_spots_array,
        hobbies: hobbies_array,
        working_out: working_out_boolean,
      }),  
    }).catch((error) => console.error("Error fetching profile: ", error));
  }

  return(
    <div className="profile-input">
    <form id="userProfile" ref={form} onSubmit={handleSubmit}>
      <label for="username">Username:</label><br/>
      <input type="text" id="username" name="username"/><br/>
      <label for="password">Password:</label><br/>
      <input type="text" id="password" name="password"/><br/>
      <label for="name">Name:</label><br/>
      <input type="text" id="name" name="name"/><br/>
      <label for="age">Age:</label><br/>
      <input type="text" id="age" age="age"/><br/>
      <label for="interests">Interests:</label><br/>
      <input type="text" id="interests" name="interests"/><br/>
      <label for="travel_spots">Travel Spots:</label><br/>
      <input type="text" id="travel_spots" name="travel_spots"/><br/>
      <label for="hobbies">Hobbies:</label><br/>
      <input type="text" id="hobbies" name="hobbies"/><br/>
      <label for="working_out">Working Out:</label><br/>
      <input type="text" id="working_out" name="working_out"/><br/>

      <input type="submit" value="Submit" />
    </form>
  </div>
  );
}

export default App;
