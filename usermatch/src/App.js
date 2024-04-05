import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './login';
import './App.css';
import Modal from "./Components/Modal";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [showForm, setShowForm] = useState(true);
    const [showMatches, setShowMatches] = useState(false);
    const [location, setLocation] = useState(null);
    const [openModal, setOpenModal] = useState(true);
    const [buddies, setBuddies] = useState([]);

    // Handle user authentication
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))

        if (!user || !user.token) {
            setLoggedIn(false);
            return;
        }

        fetch("http://localhost:3080/verify", {
            method: "POST",
            headers: {
                'jwt-token': user.token
            }
        })
        .then(r => r.json())
        .then(r => {
            setLoggedIn('success' === r.message);
            setEmail(user.email || "");
        });
    }, []);

    // Fetch possible matches based on location
    useEffect(() => {
        if (location) {
          const url = `http://localhost:3000/possiblematches?latitude=${location.latitude}&longitude=${location.longitude}&username=albert`;
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

    // Retrieve user's location
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            console.log("Geolocation not supported");
        }
    }

    // Success callback for geolocation
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
        }).catch((error) => console.error("Error updating location: ", error));
    }

    // Error callback for geolocation
    function error() {
        console.log("Unable to retrieve your location");
    }

    // Profile form input and submission
    function ProfileInput() {
        const form = React.useRef(null);

        const handleSubmit = (e) => {
            setShowForm(!showForm)
            setShowMatches(!showMatches)

            e.preventDefault();
            const formData = new FormData(form.current);

            // Extract form data
            const userProfile = {
                username: formData.get('username'),
                password: formData.get('password'),
                name: formData.get('name'),
                age: Number(formData.get('age')),
                interests: formData.get('interests').split(','),
                travel_spots: formData.get('travel_spots').split(','),
                hobbies: formData.get('hobbies').split(','),
                working_out: formData.get('working_out') === "yes",
            };

            console.log("Form has been submitted!");

            fetch('http://localhost:3000/userprofile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userProfile),
            }).catch((error) => console.error("Error updating profile: ", error));
        };

        return (
            <div className="user-profile">
                <h1>Fill out your user profile!</h1>
                <div className="profile-input">
                    <form id="userProfile" ref={form} onSubmit={handleSubmit}>
                        {/* Form fields */}
                        <label htmlFor="username">Username:</label><br />
                        <input type="text" id="username" name="username" /><br />
                        <label htmlFor="password">Password:</label><br />
                        <input type="password" id="password" name="password" /><br /> {/* Changed input type to password */}
                        <label htmlFor="name">Name:</label><br />
                        <input type="text" id="name" name="name" /><br />
                        <label htmlFor="age">Age:</label><br />
                        <input type="number" id="age" name="age" /><br /> {/* Changed input type to number */}
                        <label htmlFor="interests">Interests:</label><br />
                        <input type="text" id="interests" name="interests" /><br />
                        <label htmlFor="travel_spots">Travel Spots:</label><br />
                        <input type="text" id="travel_spots" name="travel_spots" /><br />
                        <label htmlFor="hobbies">Hobbies:</label><br />
                        <input type="text" id="hobbies" name="hobbies" /><br />
                        <label htmlFor="working_out">Working Out:</label><br />
                        <input type="radio" id="working_out_yes" name="working_out" value="yes" />
                        <label htmlFor="working_out_yes">Yes</label><br />
                        <input type="radio" id="working_out_no" name="working_out" value="no" />
                        <label htmlFor="working_out_no">No</label><br />

                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        );
    }

    // Display user matches
    function RevealUserMatches() {
        return (
            <div className="nearby-users">
                <h1>Matches Near You:</h1>
                {/* Display matches dynamically */}
                {buddies.map((buddy, index) => (
                    <div className={`match${index + 1}`} key={index}>
                        <center>
                            <img src="https://openclipart.org/download/247324/abstract-user-flat-1.svg"
                                width={50}
                                height={50}
                                alt="usericon" />
                            <p>{buddy.name}</p>
                        </center>
                        <p>Age: {buddy.age}</p>
                        <p>Interests: {buddy.interests.join(', ')}</p>
                        <p>Travel Spots: {buddy.travel_spots.join(', ')}</p>
                        <p>Hobbies: {buddy.hobbies.join(', ')}</p>
                        <p>Working Out: {String(buddy.working_out)}</p>
                        <p>Distance: Within 25 miles</p>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Modal email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
                    <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} />} />
                </Routes>
            </BrowserRouter>
            <main className="app-main">
                {openModal && <Modal closeModal={setOpenModal} getLocation={getLocation} />}
                <div className="left-section">
                    {showForm && <ProfileInput />}
                </div>
                <div className="right-section">
                    {showMatches && <RevealUserMatches />}
                </div>
            </main>
        </div>
    );
}

export default App;
