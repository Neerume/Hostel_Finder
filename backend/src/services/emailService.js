const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTP = async (to, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject: 'Your Verification OTP - Hostel Finder',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Hostel Finder Verification</h2>
                    <p>Your One-Time Password (OTP) for registration is:</p>
                    <h3 style="background-color: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 5px; font-size: 24px;">${otp}</h3>
                    <p>This OTP is valid for 15 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Could not send OTP email. Please try again later.');
    }
};

const sendNewPasswordEmail = async (to, newPassword) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject: 'New Password - Hostel Finder',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Your Password Has Been Reset</h2>
                    <p>You requested a password reset. Here is your new temporary password. Please log in and change it as soon as possible:</p>
                    <h3 style="background-color: #f4f4f4; padding: 10px; display: inline-block; letter-spacing: 2px; font-size: 24px;">${newPassword}</h3>
                    <p>If you did not request a password reset, please secure your account immediately.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('New password email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending new password email:', error);
        throw new Error('Could not send new password email. Please try again later.');
    }
};

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject,
            text,
            html: html || `<p>${text}</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // We don't necessarily want to throw and break the whole process if email fails 
        // in a non-critical flow like booking status update, but for now we follow the existing pattern.
        throw new Error('Could not send email notification.');
    }
};

module.exports = {
    sendOTP,
    sendNewPasswordEmail,
    sendEmail
};
