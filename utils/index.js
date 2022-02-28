const createToken = require("./createToken.js");
const sendUserVerificationEmail = require("./sendUserVerificationEmail");
const { createJWT, isTokenValid, attachCookiesToResponse, removeCookies } = require("./jwt");

module.exports = {
	createToken,
	sendUserVerificationEmail,
	createJWT,
	isTokenValid,
	attachCookiesToResponse,
	removeCookies,
};
