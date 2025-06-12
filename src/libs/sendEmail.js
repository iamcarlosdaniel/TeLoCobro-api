import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const handlebarOptions = {
  viewEngine: {
    extname: ".hbs",
    partialsDir: path.resolve("./src/views/email"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./src/views/email"),
  extName: ".hbs",
};

transporter.use("compile", hbs(handlebarOptions));

export async function sendEmail(to, subject, template, context) {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: to,
    subject: subject,
    template: template,
    context: {
      domain: context.domain,
      otp: context.otp,
      token: context.token,
      title: context.title || "Notification",
      message:
        context.message ||
        "Por favor, pongase en contacto con nosotros urgentemente.",
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: " + info.response);
    return "Email sent successfully";
  } catch (error) {
    throw new Error(error);
  }
}
