const sgMail = require("@sendgrid/mail");

const sendEmail = async ({ email, emailTitle, html }) => {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	// const { email, emailTitle, text, html } = req.body;
	const msg = {
		to: `${email}`,
		from: "micheltt.dev@gmail.com",
		subject: `${emailTitle}`,
		html: `${html}`,
	};

	sgMail
		.send(msg)
		.then(() => {
			console.log("Email sent");
		})
		.catch((error) => {
			console.error(error);
		});

	const info = await sgMail.send(msg);

	return info;
};

module.exports = sendEmail;
