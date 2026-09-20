export function sendSuccess(res, statusCode, message, data = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

export function sendError(res, statusCode, message, errors = undefined) {
  const body = {
    success: false,
    message
  };

  if (errors) {
    body.errors = errors;
  }

  return res.status(statusCode).json(body);
}
