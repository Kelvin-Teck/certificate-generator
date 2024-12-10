const transporter = require("../config/transporter");
// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendCertificateEmail = async (user, filePath, certificateUrl) => {
  const { name, email, role} = user;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Certificate of Completion",
    template: "certificate",
    context: {
      name,
      role: role == 'volunteer' ? 'Volunteering' : role =='participant' ? 'Participating' : 'Speaking',
      event: "MIRG-ICAIR 2024",
      theme:
        "Artificial Intelligence For Future Industrialization of Medicine in Sub-Saharan Africa",
      certificateUrl
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


const sendCertificateEmailBySendGrid = async (user, certificateUrl) => {
  const { name, email, role } = user;

  const message = {
    to: email,
    from: process.env.SENDGRID_SENDER_EMAIL, // Verified sender email
    templateId: "your-template-id", // Template ID from SendGrid dashboard
    dynamicTemplateData: {
      name: name,
      role:
        role === "volunteer"
          ? "Volunteering"
          : role === "participant"
          ? "Participating"
          : "Speaking",
      event: "MIRG-ICAIR 2024",
      theme:
        "Artificial Intelligence For Future Industrialization of Medicine in Sub-Saharan Africa",
      certificateUrl,
    },
  };

  try {
    const response = await sgMail.send(message);
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error.response?.body || error);
  }
};


module.exports = { sendCertificateEmail, sendCertificateEmailBySendGrid };
