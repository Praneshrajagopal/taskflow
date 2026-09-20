export function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`
  });
}

export function errorHandler(error, req, res, next) {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Database validation failed."
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A record with that value already exists."
    });
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.statusCode
      ? error.message
      : "An unexpected server error occurred."
  });
}
