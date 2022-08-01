const handleCastErrorDB = (err: any) => {
  return `Invalid ${err.path}: ${err.value}.`;
};

const handleDuplicateFieldsDB = (err: any) => {
  return `Duplicate field value. Please use another value!`;
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);

  return `Invalid input data. ${errors.join('. ')}`;
};

const handleJWTError = () => 'Invalid token. Please log in again!';

const handleJWTExpiredError = () =>
  'Your token has expired! Please log in again.';

export const ErrorSanitizer = (err: any) => {
  let error = { ...err };

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  return error;
};
