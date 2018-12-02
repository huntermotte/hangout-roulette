const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  venues: Array
});

// const venueSchema
// // name: String
// // notes: Array
const venueSchema = new mongoose.Schema({
  name: String,
  notes: Array,
  userID: String
  // pushing an objectw user id and their note int the notes array
});

const locationSchema = new mongoose.Schema({
  zip: Number,
  lat: Number,
  lng: Number
});

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

userSchema.methods.createExample = function() {
  return {
    _id: this._id,
    username: this.username,
    notes: this.notes
  };
}

const User = mongoose.model('User', userSchema);
const Venue = mongoose.model('Venue', venueSchema);
const Location = mongoose.model('Location', locationSchema);

module.exports = {User, Venue, Location};
