export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode === 200 ? 500 : err.statusCode;
  let message = err.message;
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = `Resource not found.`;
    statusCode = 404;
  }
  return res.status(statusCode || 500).json({
    message,
    statusCode,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};
