// models/http-error.js
class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Call the parent class constructor
    this.code = errorCode; // Custom property for HTTP status code
  }
}

module.exports = HttpError; // Export the class
