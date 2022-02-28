const { StatusCodes } = require("http-status-codes");
const CustomErrorAPi = require("./custom-error-api");

class UnauthenticatedError extends CustomErrorAPi {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.UNAUTHORIZED;
	}
}

module.exports = UnauthenticatedError;
