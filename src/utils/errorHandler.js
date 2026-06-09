// Error Handler for API responses

class APIError extends Error {
  constructor(message, statusCode = null, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.name = 'APIError';
  }
}

export const handleAPIError = (error) => {
  // Network error
  if (!error.response) {
    return {
      success: false,
      message: error.message || 'Network error. Please check your internet connection.',
      statusCode: null,
      type: 'NETWORK_ERROR',
    };
  }

  const { status, data } = error.response;
  let message = 'An error occurred.';
  let type = 'UNKNOWN_ERROR';

  // Handle different status codes
  switch (status) {
    case 400:
      // Django format: {"message": {"field": ["error1", "error2"]}}
      if (data?.message && typeof data.message === 'object') {
        const messageObj = data.message;
        const firstField = Object.keys(messageObj)[0];
        const firstError = messageObj[firstField];
        
        if (Array.isArray(firstError)) {
          message = firstError[0] || 'Invalid input';
        } else {
          message = firstError || 'Invalid input';
        }
      } else if (data?.message) {
        message = data.message;
      } else {
        message = 'Invalid input. Please check your information.';
      }
      type = 'VALIDATION_ERROR';
      break;
    case 401:
      message = 'Unauthorized. Please log in again.';
      type = 'AUTH_ERROR';
      break;
    case 403:
      message = 'You do not have permission to perform this action.';
      type = 'PERMISSION_ERROR';
      break;
    case 404:
      message = data?.message || 'This resource was not found.';
      type = 'NOT_FOUND_ERROR';
      break;
    case 429:
      message = 'Too many requests. Please try again later.';
      type = 'RATE_LIMIT_ERROR';
      break;
    case 500:
      message = 'Server error. Please try again later.';
      type = 'SERVER_ERROR';
      break;
    default:
      message = data?.message || data?.detail || message;
  }

  return {
    success: false,
    message,
    statusCode: status,
    type,
    rawError: data,
  };
};

export const getFieldErrors = (errorData) => {
  const fieldErrors = {};
  
  if (errorData?.errors) {
    // Handle errors object { field: [error1, error2] }
    Object.keys(errorData.errors).forEach(field => {
      fieldErrors[field] = Array.isArray(errorData.errors[field])
        ? errorData.errors[field][0]
        : errorData.errors[field];
    });
  }

  return fieldErrors;
};

export { APIError };
