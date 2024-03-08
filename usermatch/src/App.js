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
        <div className="left-section">
          <div className="location-button">
            <button onClick={getLocation}>Allow Location</button>
          </div>
          <div className="user-profile">
            <h1>Fill out your user profile!</h1>
            <ProfileInput/>
          </div>
        </div>
        <div className="right-section">
          <div className="nearby-users">
            <h1>Matches Near You:</h1>
            <div className="match1">
              <center><img src="https://openclipart.org/download/247324/abstract-user-flat-1.svg" 
                width={50} 
                height={50} 
                alt="usericon"/>
                <p>NAME</p></center>
              <p>Age:</p>
              <p>Interests:</p>
              <p>Travel Spots:</p>
              <p>Hobbies:</p>
              <p>Working Out:</p>
              <p>Distance:</p>
            </div>
            <div className="match2">
              <center><img src="https://openclipart.org/download/247324/abstract-user-flat-1.svg" 
                width={50} 
                height={50} 
                alt="usericon"/>
                <p>NAME</p></center>
              <p>Age:</p>
              <p>Interests:</p>
              <p>Travel Spots:</p>
              <p>Hobbies:</p>
              <p>Working Out:</p>
              <p>Distance:</p>
            </div>
            <div className="match3">
              <center><img src="https://openclipart.org/download/247324/abstract-user-flat-1.svg" 
                width={50} 
                height={50} 
                alt="usericon"/>
                <p>NAME</p></center>
              <p>Age:</p>
              <p>Interests:</p>
              <p>Travel Spots:</p>
              <p>Hobbies:</p>
              <p>Working Out:</p>
              <p>Distance:</p>
            </div>
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
    <GetRadioValue/>
    console.log("Form has been submitted!");

    // food,travel,studying transforms into: ['food', 'travel', studying]
    const age_int = Number(age);
    const interests_array = interests.split(',');
    const travel_spots_array = travel_spots.split(',');
    const hobbies_array = hobbies.split(',');
    let working_out_boolean = false;
    // if (working_out === 'yes'){
    //   working_out_boolean = true;
    // }

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
      <input type="radio" id="working_out_yes" name="working_out" value="yes"/>
      <label for="yes">Yes</label><br/>
      <input type="radio" id="working_out_no" name="working_out" value="no"/>
      <label for="yes">No</label><br/>

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
