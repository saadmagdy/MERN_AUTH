class ApiError extends Error {
  constructor() {
    super();
  }
  create(message, statusCode) {
    this.message = message;
    this.statusCode = statusCode;
    return this;
  }
}

export default new ApiError();
