const { StatusCodes } = require("http-status-codes");
const CustomErrorAPi = require("./custom-error-api");

class UnauthorizedError extends CustomErrorAPi {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.FORBIDDEN;
	}
}

module.exports = UnauthorizedError;
