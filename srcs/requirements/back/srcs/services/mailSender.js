import dotenv from "dotenv"
import nodemailer from "nodemailer"; // for 2FA

dotenv.config()

const mailSender = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export default mailSender
