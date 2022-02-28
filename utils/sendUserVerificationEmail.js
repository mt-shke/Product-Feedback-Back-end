const sendEmail = require("./sendEmail");

const sendUserVerificationEmail = async ({ email, verificationToken }) => {
	const domain = process.env.DOMAIN || "http://localhost:5000";

	const emailTitle = "Verify your account";
	const html = `<p>Please click the following link to activate your account: <a href="${domain}/users/verify-email?token=${verificationToken}&email=${email}">Confirm email</a> </p>`;

	const info = await sendEmail({ email, emailTitle, html });

	return info;
};

module.exports = sendUserVerificationEmail;
