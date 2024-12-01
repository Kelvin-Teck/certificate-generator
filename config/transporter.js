const nodemailer = require("nodemailer");
const { create } = require("express-handlebars");
const path = require("path");

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  service: process.env.EMAIL_SERVICE,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Configure Handlebars view engine
const hbs = create({
  extname: ".hbs", // Extension for Handlebars templates
  defaultLayout: false, // No default layout
});

(async () => {
  const nodemailerhbs = (await import("nodemailer-express-handlebars")).default;

  // Handlebars options for Nodemailer
  const handlebarsOptions = {
    viewEngine: hbs,
    viewPath: path.resolve(__dirname, "../mailers/views/"),
    extName: ".hbs",
  };

  // Use Handlebars with Nodemailer
  transporter.use("compile", nodemailerhbs(handlebarsOptions));
})();

module.exports = transporter;
