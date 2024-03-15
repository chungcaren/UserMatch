import React, { useState, useRef, useEffect } from 'react'; // Import React and necessary hooks
import './App.css'; // Import the CSS file for styling
import Modal from "./Components/Modal";

function App() {
  const [location, setLocation] = useState(null);

  function getLocation() {
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

  const [openModal, setOpenModal] = useState(true)

  const [buddies, setBuddies] = useState([]);

  useEffect(() => {
    if (location) {
      const url = 'http://localhost:3000/possiblematches' + '?latitude=' + location.latitude + '&longitude=' + location.longitude + '&username=albert';
      fetch(url, {
        method: 'GET',
      }).then(
        async (data) => {
          const buddies = await data.json();
          setBuddies(buddies);
        }
      ).catch((error) => console.error("Error fetching matches: ", error));
    }
  }, [location]);


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
      const working_out_boolean = GetRadioValue('working_out');

      console.log("Form has been submitted!");

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
    };

    return (
      <div className="profile-input">
        <form id="userProfile" ref={form} onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label><br />
          <input type="text" id="username" name="username" /><br />
          <label htmlFor="password">Password:</label><br />
          <input type="text" id="password" name="password" /><br />
          <label htmlFor="name">Name:</label><br />
          <input type="text" id="name" name="name" /><br />
          <label htmlFor="age">Age:</label><br />
          <input type="text" id="age" name="age" /><br />
          <label htmlFor="interests">Interests:</label><br />
          <input type="text" id="interests" name="interests" /><br />
          <label htmlFor="travel_spots">Travel Spots:</label><br />
          <input type="text" id="travel_spots" name="travel_spots" /><br />
          <label htmlFor="hobbies">Hobbies:</label><br />
          <input type="text" id="hobbies" name="hobbies" /><br />
          <label htmlFor="working_out">Working Out:</label><br />
          <input type="radio" id="working_out_yes" name="working_out" value="yes" />
          <label htmlFor="yes">Yes</label><br />
          <input type="radio" id="working_out_no" name="working_out" value="no" />
          <label htmlFor="no">No</label><br />

          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }

  function GetRadioValue(working_out) {
    var radio = document.forms[0].elements[working_out];
    for (var i = 0; i < radio.length; i++) {
      if (radio[i].checked) {
        if (radio[i].value === "yes") {
          return true;
        }
      }
    }
    return false;
  }

  return (
    <main className="app-main">
      {openModal && <Modal closeModal={setOpenModal} />}
      <div className="left-section">
        <div className="location-button">
          <button onClick={getLocation}>Allow Location</button>
        </div>
        <div className="user-profile">
          <h1>Fill out your user profile!</h1>
          <ProfileInput />
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
              <p>{buddies[0] !== undefined ? buddies[0].name : 'NAME'}</p></center>
            <p>Age: {buddies[0] !== undefined ? buddies[0].age : ''}</p>
            <p>Interests: {buddies[0] !== undefined ? buddies[0].interests : ''}</p>
            <p>Travel Spots: {buddies[0] !== undefined ? buddies[0].travel_spots : ''}</p>
            <p>Hobbies: {buddies[0] !== undefined ? buddies[0].hobbies : ''}</p>
            <p>Working Out: {buddies[0] !== undefined ? String(buddies[0].working_out) : ''}</p>
            <p>Distance: With 25 miles</p> 
          </div>
          <div className="match2">
            <center><img src="https://openclipart.org/download/247324/abstract-user-flat-1.svg" 
              width={50} 
              height={50} 
              alt="usericon"/>
              <p>{buddies[1] !== undefined ? buddies[1].name : 'NAME'}</p></center>
            <p>Age: {buddies[1] !== undefined ? buddies[1].age : ''}</p>
            <p>Interests: {buddies[1] !== undefined ? buddies[1].interests : ''}</p>
            <p>Travel Spots: {buddies[1] !== undefined ? buddies[1].travel_spots : ''}</p>
            <p>Hobbies: {buddies[1] !== undefined ? buddies[1].hobbies : ''}</p>
            <p>Working Out: {buddies[1] !== undefined ? String(buddies[1].working_out) : ''}</p>
            <p>Distance: Within 25 miles</p>
          </div>
          <div className="match3">
            <center><img src="https://openclipart.org/download/247324/abstract-user-flat-1.svg" 
              width={50} 
              height={50} 
              alt="usericon"/>
              <p>{buddies[2] !== undefined ? buddies[2].name : 'NAME'}</p></center>
            <p>Age: {buddies[2] !== undefined ? buddies[2].age : ''}</p>
            <p>Interests: {buddies[2] !== undefined ? buddies[2].interests : ''}</p>
            <p>Travel Spots: {buddies[2] !== undefined ? buddies[2].travel_spots : ''}</p>
            <p>Hobbies: {buddies[2] !== undefined ? buddies[2].hobbies : ''}</p>
            <p>Working Out: {buddies[2] !== undefined ? String(buddies[2].working_out) : ''}</p>
            <p>Distance: Within 25 miles</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
