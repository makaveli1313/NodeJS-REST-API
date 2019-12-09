const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BootcampSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more then 50 characters'],
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more then 500 characters'],
  },
  website: {
    type: String,
    match: [
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
      'Please use valid URL with HTTP or HTTPS',
    ],
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be longer then 20 characters'],
  },
  email: {
    type: String,
    match: [
      /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/,
      'Please add a valid email',
    ],
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  location: {
    //GeoJSON point
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere',
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other',
    ],
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating can not be more than 10'],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpeg ',
  },
  housing:{
    type: Boolean,
    default: false
  },
  jobAssistance:{
    type: Boolean,
    default: false
  },
  jobGuarantee:{
    type: Boolean,
    default: false
  },
  acceptGi :{
    type: Boolean,
    default: false
  },
  createdAt:{
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);
