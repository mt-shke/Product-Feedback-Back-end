const { StatusCodes } = require("http-status-codes");
const CustomErrorAPi = require("./custom-error-api");

class BadRequestError extends CustomErrorAPi {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.BAD_REQUEST;
	}
}

module.exports = BadRequestError;
