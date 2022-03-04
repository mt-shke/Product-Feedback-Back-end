const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
	const token = jwt.sign(payload, process.env.JWT_SECRET);
	return token;
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
	const accessTokenJWT = createJWT({ payload: { user } });
	const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

	const TOKEN_15MINUTES = 1000 * 60 * 15;
	const TOKEN_30DAYS = 1000 * 60 * 60 * 24 * 30;
	res.cookie("accessToken", accessTokenJWT, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		domain: ".micheltcha.com",

		signed: true,
		expires: new Date(Date.now() + TOKEN_15MINUTES),
	});
	res.cookie("refreshToken", refreshTokenJWT, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		domain: ".micheltcha.com",
		signed: true,
		expires: new Date(Date.now() + TOKEN_30DAYS),
	});
};

const removeCookies = ({ res }) => {
	res.cookie("accessToken", "logout", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		domain: ".micheltcha.com",

		signed: true,
		expires: new Date(Date.now()),
	});
	res.cookie("refreshToken", "logout", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		domain: ".micheltcha.com",

		signed: true,
		expires: new Date(Date.now()),
	});
};

module.exports = { attachCookiesToResponse, createJWT, isTokenValid, removeCookies };

// const attachCookiesToResponse = ({ res, user, refreshToken }) => {
// 	const accessTokenJWT = createJWT({ payload: { user } });
// 	const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

// 	const oneDay = 1000 * 60 * 60 * 24;
// 	const longerExp = 1000 * 60 * 60 * 24 * 30;

// 	res.cookie("accessToken", accessTokenJWT, {
// 		httpOnly: true,
// 		secure: process.env.NODE_ENV === "production",
// 		signed: true,
// 		expires: new Date(Date.now() + oneDay),
// 	});

// 	res.cookie("refreshToken", refreshTokenJWT, {
// 		httpOnly: true,
// 		secure: process.env.NODE_ENV === "production",
// 		signed: true,
// 		expires: new Date(Date.now() + longerExp),
// 	});
// };

// const attachPasswordToken = ({ res, user, token }) => {
// 	const passwordToken = createJWT({ payload: { user } });
// 	const fiveMinutes = 1000 * 60 * 5;

// 	res.cookie("passwordToken", passwordToken, {
// 		httpOnly: true,
// 		expires: new Date(Date.now() + fiveMinutes),
// 		secure: process.env.NODE_ENV === "production",
// 		signed: true,
// 	});
// };
