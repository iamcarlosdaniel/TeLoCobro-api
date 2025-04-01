import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  secure: true,
  port: 465,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
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
