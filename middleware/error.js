const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.log(err.stack.red);

  //Mongoose bad ObjectId
  if ((error.name = 'CastError')) {
    const message = `Resource not found with id ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  console.log(error.message.red);
  console.log(err.name.green)
  res
    .status(error.statusCode || 500)
    .json({ succes: false, error: error.message });
};

module.exports = errorHandler;
