const { StatusCodes } = require("http-status-codes");
const CustomErrorAPi = require("./custom-error-api");

class NotFoundError extends CustomErrorAPi {
	constructor(message) {
		super(message);
		this.statusCode = StatusCodes.NOT_FOUND;
	}
}

module.exports = NotFoundError;
