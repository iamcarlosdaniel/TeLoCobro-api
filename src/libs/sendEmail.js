import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import Dev from "../database/models/dev.model.js";

const handlebarOptions = {
  viewEngine: {
    extname: ".hbs",
    partialsDir: path.resolve("./src/views/email"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./src/views/email"),
  extName: ".hbs",
};

export async function sendEmail(to, subject, template, context) {
  const devConfig = await Dev.findOne({ _id: "685748bcbcfd98285bd02285" });
  if (!devConfig) {
    throw {
      status: 500,
      userErrorMessage:
        "DEV ERROR: No se encontró la configuración de desarrollo. Por favor, configure las credenciales de correo.",
    };
  }

  if (devConfig.mail_service !== "gmail") {
    throw {
      status: 500,
      userErrorMessage:
        "DEV ERROR: El servicio de correo configurado no es compatible. Solo se admite 'gmail'.",
    };
  }

  if (
    devConfig.mail_service_user === "" ||
    devConfig.mail_service_password === ""
  ) {
    throw {
      status: 500,
      userErrorMessage:
        "DEV ERROR: Las credenciales del servicio de correo no están configuradas correctamente.",
    };
  }

  const transporter = nodemailer.createTransport({
    service: devConfig.mail_service,
    auth: {
      user: devConfig.mail_service_user,
      pass: devConfig.mail_service_password,
    },
  });

  transporter.use("compile", hbs(handlebarOptions));

  const mailOptions = {
    from: devConfig.mail_service_user,
    to,
    subject,
    template,
    context: {
      domain: context.domain,
      otp: context.otp,
      token: context.token,
      title: context.title || "Notification",
      message:
        context.message ||
        "Por favor, póngase en contacto con nosotros urgentemente.",
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado: " + info.response);
    return "Email sent successfully";
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw {
      status: error.status,
      message: error.userErrorMessage,
    };
  }
}
