import React, { useState, useRef } from 'react';
import './App.css';
import Login from './login';

function App() {
  const [location, setLocation] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Define isLoggedIn state

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
  
  function handleLogin() {
    // Perform login logic
    // For now, let's assume a successful login if username and password are not empty
    setIsLoggedIn(true);
  }

  return (
    <main className="app-main">
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <div className="location-button">
          <button onClick={getLocation}>Allow Location</button>
        </div>
      </div>
      <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
        <div className="user-profile">
          <h1>Fill out your user profile!</h1>
          <ProfileInput/>
        </div>
          <div className="login">
          <h1>Fill out your user profile!</h1>
          <Login/>
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
    // const working_out = formData.get('working_out');
    const working_out_boolean = GetRadioValue('working_out');
    console.log("Form has been submitted!");

    // food,travel,studying transforms into: ['food', 'travel', studying]
    const age_int = Number(age);
    const interests_array = interests.split(',');
    const travel_spots_array = travel_spots.split(',');
    const hobbies_array = hobbies.split(',');

    fetch('http://localhost:3000/userprofile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
        name: name,
        age: age_int,
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
      <label htmlFor="username">Username:</label><br/>
      <input type="text" id="username" name="username"/><br/>
      <label htmlFor="password">Password:</label><br/>
      <input type="text" id="password" name="password"/><br/>
      <label htmlFor="name">Name:</label><br/>
      <input type="text" id="name" name="name"/><br/>
      <label htmlFor="age">Age:</label><br/>
      <input type="text" id="age" age="age"/><br/>
      <label htmlFor="interests">Interests:</label><br/>
      <input type="text" id="interests" name="interests"/><br/>
      <label htmlFor="travel_spots">Travel Spots:</label><br/>
      <input type="text" id="travel_spots" name="travel_spots"/><br/>
      <label htmlFor="hobbies">Hobbies:</label><br/>
      <input type="text" id="hobbies" name="hobbies"/><br/>
      <label htmlFor="working_out">Working Out:</label><br/>
      <input type="radio" id="working_out_yes" name="working_out" value="yes"/>
      <label htmlFor="yes">Yes</label><br/>
      <input type="radio" id="working_out_no" name="working_out" value="no"/>
      <label htmlFor="yes">No</label><br/>

      <input type="submit" value="Submit" />
    </form>
  </div>
  );

  function GetRadioValue(working_out) {
    var radio = document.forms[0].elements[working_out];
    for(var i = 0; i < radio.length; i++){
      if(radio[i].checked){
        if(radio[i].value == "Yes"){
          var working_out_boolean = true;
        }
      }
    }
  }
}

export default App;
