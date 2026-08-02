const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

console.log("========== EMAIL CONFIG ==========");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS EXISTS:", !!process.env.EMAIL_PASS);
console.log("==================================");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,

    tls: {
        rejectUnauthorized: false,
    },
});

// transporter.verify() ko comment kar diya hai
// SMTP verify startup par zaruri nahi hota

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {

        console.log("========== BOOKING EMAIL ==========");
        console.log("To:", userEmail);

        const info = await transporter.sendMail({
            from: `"Eventora" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Booking Confirmed: ${eventTitle}`,
            html: `
                <h2>Hi ${userName}!</h2>
                <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
                <p>Thank you for choosing Eventora.</p>
            `,
        });

        console.log("✅ Booking Email Sent");
        console.log(info);

        return info;

    } catch (error) {

        console.error("❌ Booking Email Error");
        console.error(error);

        throw error;
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {

    try {

        console.log("========== OTP EMAIL ==========");
        console.log("To:", userEmail);
        console.log("OTP:", otp);
        console.log("Type:", type);

        const title =
            type === "account_verification"
                ? "Verify your Eventora Account"
                : "Event Booking Verification";

        const msg =
            type === "account_verification"
                ? "Please use the following OTP to verify your account."
                : "Please use the following OTP to verify your booking.";

        const info = await transporter.sendMail({
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

        console.log("========== EMAIL SENT ==========");
        console.log("Message ID :", info.messageId);
        console.log("Accepted  :", info.accepted);
        console.log("Rejected  :", info.rejected);
        console.log("Response  :", info.response);
        console.log("===============================");

        return info;

    } catch (error) {

        console.error("========== SMTP ERROR ==========");
        console.error("Name     :", error.name);
        console.error("Code     :", error.code);
        console.error("Message  :", error.message);
        console.error("Command  :", error.command);
        console.error("Response :", error.response);
        console.error("Stack    :", error.stack);
        console.error("===============================");

        throw error;
    }
};

module.exports = {
    sendBookingEmail,
    sendOTPEmail,
};