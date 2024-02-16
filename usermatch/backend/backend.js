
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const schemas = require('./userSchema'); 

const app = express();
const PORT = 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost/travelplans', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', schemas.userSchema);

// Middleware
app.use(bodyParser.json());

// Endpoints
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && password === user.password) {
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


app.post('/userprofile', async (req, res) => {
  const { username, password, name, age, interests, travel_spots, hobbies, working_out, location } = req.body;

  // Extract longitude and latitude from the location object in the request body
  const longitude = location.coordinates[0];
  const latitude = location.coordinates[1];

  try {
    let user = await User.findOne({ username });
    if (user) {
      // Update existing user profile
      user.name = name;
      user.age = age;
      user.interests = interests;
      user.travel_spots = travel_spots;
      user.hobbies = hobbies;
      user.working_out = working_out;
      user.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };
    } else {
      // Create a new user profile
      user = new User({ username, password, name, age, interests, travel_spots, hobbies, working_out, location: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] } });
    }

    await user.save();
    res.status(201).json({ message: 'Profile successfully created/updated' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


app.post('/user/:id/location', async (req, res) => {
  const userId = req.params.id;
  const { latitude, longitude } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user's location
    user.location = {
      type: 'Point',
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };

    await user.save();
    res.status(200).json({ message: 'Location updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


app.get('/interests', async (req, res) => {
  const { username } = req.query;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find potential matches based on common interests
    const potentialMatches = await User.find({
      username: { $ne: username }, // Exclude the current user
      interests: { $in: user.interests }, // Find users with at least one common interest
    });

    res.status(200).json(potentialMatches);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/possiblematches', async (req, res) => {
  const { username, latitude, longitude } = req.query;

  try {
    const currentUser = await User.findOne({ username });
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find potential matches based on proximity, demographics, and user behavior
    const potentialMatches = await User.find({
      username: { $ne: username }, // Exclude the current user
      interests: { $in: currentUser.interests }, // Find users with at least one common interest
      age: { $gte: currentUser.age - 5, $lte: currentUser.age + 5 }, // Age within 5 years difference
      working_out: currentUser.working_out, // Match based on working out preference
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: 100000, // Maximum distance in meters (adjust as needed)
        },
      },
    });

    res.status(200).json(potentialMatches);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
