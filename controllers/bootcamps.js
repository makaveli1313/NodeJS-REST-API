const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: { bootcamps } });
});

// @desc Get single bootcamp
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: { data: bootcamp }
  });
});

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data: { bootcamp } });
});

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }

  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findOneAndDelete(req.params.id);

  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }

  res.status().json({
    success: true
  });
});

// @desc Get bootcamps within a radius
// @route get /api/v1/bootcamps/radius/:zipcode/:distance
// @access Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const { latitude, longitude } = loc[0];

  // Get bootcamps by radius
  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], distance / 3963] }
    }
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: { bootcamps } });
});
