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
    
    fetch('http://localhost:3000/updateLocation')
      .then((res) => res.json())
      .then((data) => setLocation(data))
      .catch((error) => console.error("Error fetching location: ", error));
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  return (
    <main className="app-main">
      <div className="location-button">
        <button onClick={getLocation}>Allow Location</button>
      </div>
      <div>
        <profileInput/>
      </div>
  </main>
  );
}

function profileInput() {
  const setProfile = Array.from(document.querySelectorAll('#userProfile input')).reduce((acc, input) => ({...acc, [input.id]: input.value }), {});
  
  fetch('http://localhost:3000/userprofile')
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((error) => console.error("Error fetching profile: ", error));

  return(
    <div className="profile-input">
    <form id="userProfile">
      <label for="name">Name:</label><br/>
      <input type="text" id="name" name="name"/><br/>
      <label for="age">Age:</label><br/>
      <input type="text" id="age" age="age"/><br/>

      <label for="interests">Interests/Hobbies:</label><br/>
      <input type="checkbox" id="interest1" name="interest1" value="Traveling"/>
      <label for="interest1"> Traveling</label><br/>
      <input type="checkbox" id="interest2" name="interest2" value="Working Out"/>
      <label for="interest2"> Working Out</label><br/>
      <input type="checkbox" id="interest3" name="interest3" value="Eating"/>
      <label for="interest3"> Eating</label><br/>
      <input type="checkbox" id="interest4" name="interest4" value="Art"/>
      <label for="interest4"> Art</label><br/>
      <input type="checkbox" id="interest5" name="interest5" value="Gaming"/>
      <label for="interest5"> Gaming</label><br/>
      
      <label for="travelSpots">Travel Spots:</label><br/>
      <input type="checkbox" id="country1" name="country1" value="Spain"/>
      <label for="country1"> Spain</label><br/>
      <input type="checkbox" id="country2" name="country2" value="France"/>
      <label for="country2"> France</label><br/>
      <input type="checkbox" id="country3" name="country3" value="Japan"/>
      <label for="country3"> Japan</label><br/>
      <input type="checkbox" id="country4" name="country4" value="Korea"/>
      <label for="country4"> Korea</label><br/>
      <input type="checkbox" id="country5" name="country5" value="Switzerland"/>
      <label for="country5"> Switzerland</label><br/>

      <input type="submit" value="Submit" onClick/>
    </form>
  </div>
  );
}

export default App;
