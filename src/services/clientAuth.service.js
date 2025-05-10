import Client from "../database/models/client.model.js";

class ClientAuthService {
  async requestAccess(email) {
    try {
      const clientFound = await Client.findOne({ email });
      if (!clientFound) {
        throw {
          status: 404,
          userErrorMessage: "No se encontro el cliente proporcionado.",
        };
      }
      const { otp, expireAt } = await createOTP(100000, 999999, 3);

      const clientUpdated = await Client.findByIdAndUpdate(
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

      return clientUpdated;
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async verifyAccess(email, otp) {
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
      const clientUpdated = await Client.findByIdAndUpdate(
        clientFound._id,
        {
          app_access_enable: true,
        },
        { new: true }
      );

      return clientUpdated;
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
