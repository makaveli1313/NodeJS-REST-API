const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const Schema = mongoose.Schema;

const BootcampSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please add name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more then 50 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more then 500 characters']
  },
  website: {
    type: String,
    match: [
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
      'Please use valid URL with HTTP or HTTPS'
    ]
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number can not be longer then 20 characters']
  },
  email: {
    type: String,
    match: [
      /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/,
      'Please add a valid email'
    ]
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    //GeoJSON point
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'] // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
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
      'Other'
    ]
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating can not be more than 10']
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpeg '
  },
  housing: {
    type: Boolean,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: false
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGi: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

//Create bootcamp slug from the name

BootcampSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

//Geocode & create location field

BootcampSchema.pre('save', async function(next) {

  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countrycode
  };
  next();
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);
