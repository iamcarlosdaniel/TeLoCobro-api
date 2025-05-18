import Client from "../database/models/client.model.js";
import Session from "../database/models/session.model.js";

import { createAccessToken } from "../libs/createAccessToken.js";
import { createOTP } from "../libs/createOneTimePassword.js";
import { sendEmail } from "../libs/sendEmail.js";

class ClientAuthService {
  async getCompaniesWithMyEmail(email) {
    try {
      const clientsFound = await Client.find({ email: email })
        .select("_id")
        .populate({
          path: "company_id",
          select: "-_id name legal_name",
        });

      if (!clientsFound) {
        throw {
          status: 404,
          userErrorMessage:
            "La dirección de correo electrónico no está afiliada a ninguna empresa.",
        };
      }

      return {
        message: "Clientes encontrados",
        clients: clientsFound,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async requestAccess(clientId) {
    try {
      const clientFound = await Client.findById(clientId);
      if (!clientFound) {
        throw {
          status: 404,
          userErrorMessage: "No se encontro el cliente proporcionado.",
        };
      }
      const { otp, expireAt } = await createOTP(100000, 999999, 3);

      await Client.findByIdAndUpdate(
        clientFound._id,
        {
          app_verify_otp: otp,
          app_verify_otp_expired_at: expireAt,
        },
        { new: true }
      );

      const context = {
        domain: process.env.CLIENT_URL,
        otp: otp,
      };

      sendEmail(
        clientFound.email,
        "Confirma tu cuenta",
        "confirmAccountTemplate",
        context
      );

      return {
        message: `Hemos enviado un correo a ${clientFound.email} para vericar tu identidad.`,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async signIn(clientId, otp) {
    try {
      const clientFound = await Client.findById(clientId);

      if (!clientFound) {
        throw {
          status: 404,
          userErrorMessage: "No se encontro el cliente proporcionado.",
        };
      }
      if (clientFound.app_verify_otp !== otp) {
        throw {
          status: 400,
          userErrorMessage: "El OTP proporcionado es incorrecto.",
        };
      }

      if (clientFound.app_verify_otp_expired_at < new Date()) {
        throw {
          status: 400,
          userErrorMessage: "El OTP proporcionado ha expirado.",
        };
      }

      await Client.findByIdAndUpdate(
        clientFound._id,
        {
          app_verify_otp: null,
          app_verify_otp_expired_at: null,
          app_access_enable: true,
        },
        { new: true }
      );

      console.log("clientFound", clientFound);
      const authToken = await createAccessToken(
        {
          id: clientFound._id,
          user_type: "client",
        },
        "7d"
      );

      const newSession = new Session({
        user_type: "client",
        user_id: clientFound._id,
        device_type: "mobile",
        auth_token: authToken,
      });

      await newSession.save();

      const context = {};

      await sendEmail(
        clientFound.email,
        "Bienvenido a la app movil",
        "welcomeAppTemplate",
        context
      );

      return {
        message: `Bienvenido ${clientFound.name}`,
        auth_token: authToken,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async authStatus(clientId) {
    try {
      const clientFound = await Client.findById(clientId).select(
        "_id erp_client_id name nit email phone_number "
      );

      if (!clientFound) {
        throw {
          status: 404,
          userErrorMessage: "No se encontro el cliente proporcionado.",
        };
      }

      return {
        message: "Sesion activa.",
        user: clientFound,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async signOut(clientId) {
    try {
      const clientFound = await Client.findById(clientId);
      if (!clientFound) {
        throw {
          status: 404,
          userErrorMessage: "No se encontro el cliente proporcionado.",
        };
      }
      await Client.findByIdAndUpdate(
        clientFound._id,
        {
          app_access: false,
        },
        { new: true }
      );
      await Session.deleteMany({ user_id: clientFound._id });
      return {
        message: `Hasta luego ${clientFound.name}`,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }
}

export default new ClientAuthService();
