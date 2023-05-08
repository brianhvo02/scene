import {model, Schema} from 'mongoose';

const userSchema = new Schema({
  username:{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  genre :{
    type: [Number],
    required: false
  },
  likedMovies: {
    type: [Number],
    required: false
  }
}, {
  timestamps: true
})

module.exports = model('User', userSchema)