const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    age: Number,
    interests: [String],
    travel_spots: [String],
    hobbies: [String],
    working_out: Boolean,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  });