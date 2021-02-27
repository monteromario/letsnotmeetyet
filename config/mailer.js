const nodemailer = require("nodemailer");
const { generateTemplate } = require("./mailtemplate");

const transporter = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: process.env.GMAIL_USER,
		pass: process.env.GMAIL_PASSWORD
	}
});

module.exports.sendActivationEmail = (email, firstName, activationToken) => {
	transporter.sendMail({
		from: `"Let's Not Meet Yet" <${process.env.GMAIL_USER}>`,
		to: email,
		subject: "Activate your account to join Let's Not Meet Yet",
		html: generateTemplate(firstName, activationToken)
	})
};