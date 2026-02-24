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

module.exports = {
    sendOTP
};
