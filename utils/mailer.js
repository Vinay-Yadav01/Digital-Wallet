const nodemailer = require("nodemailer");

// Mock transporter (does NOT send real mail)
const transporter = nodemailer.createTransport({
  jsonTransport: true, // For console output only
});

const sendMockEmail = async (to, subject, message) => {
  const mailOptions = {
    from: "noreply@digitalwallet.com",
    to,
    subject,
    text: message,
  };

  const result = await transporter.sendMail(mailOptions);
  console.log("📧 Mock email sent:", result.message);
};

module.exports = sendMockEmail;
