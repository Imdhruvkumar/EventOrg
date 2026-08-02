const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

console.log("========== EMAIL CONFIG ==========");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS EXISTS:", !!process.env.EMAIL_PASS);
console.log("==================================");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("❌ SMTP VERIFY ERROR");
        console.error(error);
    } else {
        console.log("✅ SMTP SERVER READY");
    }
});

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

        console.log("✅ BOOKING EMAIL SENT");
        console.log("Message ID:", info.messageId);
        console.log("Accepted:", info.accepted);
        console.log("Rejected:", info.rejected);
        console.log("Response:", info.response);

    } catch (error) {
        console.error("❌ BOOKING EMAIL ERROR");
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

        console.log("✅ OTP EMAIL SENT SUCCESSFULLY");
        console.log("Message ID:", info.messageId);
        console.log("Accepted:", info.accepted);
        console.log("Rejected:", info.rejected);
        console.log("Response:", info.response);

    } catch (error) {

        console.error("❌ OTP EMAIL ERROR");
        console.error("Name:", error.name);
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Command:", error.command);
        console.error("Stack:", error.stack);

        throw error;
    }
};

module.exports = {
    sendBookingEmail,
    sendOTPEmail,
};