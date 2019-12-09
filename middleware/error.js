const errorHandler = (err, req, res, next) => {
  console.log(err.stack.red);

  res.status(500).json({ succes: false, error: err.message });
};

module.exports = errorHandler;