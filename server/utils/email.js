const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Connection Error:", error);
    } else {
        console.log("SMTP Server is Ready");
    }
});

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        await transporter.sendMail({
            from: `"Eventora" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Booking Confirmed: ${eventTitle}`,
            html: `
                <h2>Hi ${userName}!</h2>
                <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
                <p>Thank you for choosing Eventora.</p>
            `,
        });

        console.log("Booking email sent to:", userEmail);
    } catch (error) {
        console.error("Booking Email Error:", error);
        throw error;
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        const title =
            type === "account_verification"
                ? "Verify your Eventora Account"
                : "Event Booking Verification";

        const msg =
            type === "account_verification"
                ? "Please use the following OTP to verify your account."
                : "Please use the following OTP to verify your booking.";

        await transporter.sendMail({
            from: `"Eventora" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: title,
            html: `
                <div style="font-family:Arial,sans-serif;padding:20px;text-align:center">
                    <h2>${title}</h2>
                    <p>${msg}</p>

                    <div style="
                        font-size:32px;
                        font-weight:bold;
                        letter-spacing:8px;
                        background:#f3f3f3;
                        padding:15px;
                        width:220px;
                        margin:20px auto;
                        border-radius:8px;">
                        ${otp}
                    </div>

                    <p>This OTP expires in 5 minutes.</p>
                </div>
            `,
        });

        console.log(`OTP sent successfully to ${userEmail}`);
    } catch (error) {
        console.error("OTP Email Error:", error);
        throw error;
    }
};

module.exports = {
    sendBookingEmail,
    sendOTPEmail,
};