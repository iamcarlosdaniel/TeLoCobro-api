import Client from "../database/models/client.model.js";
import Session from "../database/models/session.model.js";

import { createAccessToken } from "../libs/createAccessToken.js";
import { createOTP } from "../libs/createOneTimePassword.js";
import { sendEmail } from "../libs/sendEmail.js";

class ClientAuthService {
  async requestAccess(email) {
    try {
      const clientFound = await Client.findOne({ email: email });
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
      sendEmail(email, "Confirma tu cuenta", "confirmAccountTemplate", context);

      return {
        message: `Hemos enviado un correo a ${email} para vericar tu identidad.`,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async signIn(email, otp) {
    try {
      const clientFound = await Client.findOne({ email });
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
          app_access_enable: false,
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
