import dotenv from "dotenv"
import nodemailer from "nodemailer"; // for 2FA

dotenv.config()

const mailSender = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: parseInt(process.env.SMTP_PORT),
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS
		}
	},
	{
		from: '"Transcendence" <no-reply@transcendence.com>',
		subject: "Two-Factor-Authentification",
	}
)

export default mailSender