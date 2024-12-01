const transporter = require("../config/transporter");

const sendCertificateEmail = async (user, filePath) => {
  const { name, email, role} = user;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Certificate of Completion",
    template: "certificate",
    context: {
      name,
      role: role == 'volunteer' ? 'Volunteering' : 'Participating' ,
      event: "MIRG-ICAIR 2024",
      theme:
        "Artificial Intelligence For Future Industrialization of Medicine in Sub-Saharan Africa",
    },
    attachments: [
      {
        filename: `${name}_certificate.png`,
        path: filePath, // Local file path of the certificate
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendCertificateEmail };
