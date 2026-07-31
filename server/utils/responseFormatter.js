/**
 * Formats API responses consistently across the application.
 *
 * @param {boolean} success - Indicates if the request was successful
 * @param {string} message - Descriptive message about the operation result
 * @param {Object|Array|null} data - The payload data
 * @param {Object|Array|null} errors - Detailed errors (e.g., validation errors)
 * @returns {Object} Standardized response object
 */
const formatResponse = (success, message = "", data = null, errors = null) => {
  return {
    success,
    message,
    data,
    errors
  };
};

module.exports = formatResponse;
