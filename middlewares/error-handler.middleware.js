const errorHandler = (error, _, res, next) => {
  console.error(error.stack); //this should call a logger at scale
  res
    .status(500)
    .json({
      success: false,
      message: "error occured , see the errorMessage key for more details",
      errorMessage: error.message,
    });
};

module.exports = { errorHandler };
