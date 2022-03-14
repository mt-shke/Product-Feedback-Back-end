const sendEmail = require("./sendEmail");

const sendUserVerificationEmail = async ({ email, verificationToken }) => {
	const domain = process.env.DOMAIN || "https://fm.pfeedback.micheltcha.com";

	const emailTitle = "Verify your account";
	const html = `<p>Please click the following link to activate your account: <a href="${domain}/new-account/verify-email?token=${verificationToken}&email=${email}">Confirm email</a> </p>`;

	const info = await sendEmail({ email, emailTitle, html });

	return info;
};

module.exports = sendUserVerificationEmail;
