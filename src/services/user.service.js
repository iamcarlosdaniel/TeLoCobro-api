import User from "../database/models/user.model.js";

class UserService {
  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select("-password -__v");

      if (!user) {
        throw {
          status: 404,
          message: "Usuario no encontrado.",
        };
      }

      return {
        message: "Usuario encontrado.",
      };
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }

  async editUserInformation(userId, userData) {
    try {
      const userFound = await User.findById(userId).select("-password -__v");

      if (!userFound) {
        throw {
          status: 404,
          userErrorMessage: "Usuario no encontrado.",
        };
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          date_of_birth: userData.date_of_birth,
        },
        {
          new: true,
        }
      ).select("-password -__v");

      return {
        message: "Informacion actualizada exitosamente.",
        data: updatedUser,
      };
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }

  async emailChangeRequest(userData, newEmail) {
    try {
      const userFound = await User.findById(userData.id).select("__v");

      if (!userFound) {
        throw {
          status: 404,
          userErrorMessage: "Usuario no encontrado.",
        };
      }

      const isMarched = await bcrypt.compare(
        userData.password,
        userFound.password
      );

      if (!isMarched) {
        throw {
          status: 403,
          userErrorMessage: "La contraseña es incorrecta.",
        };
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      const expireAt = Date.now() + 15 * 60 * 1000;

      await User.findOneAndUpdate(
        { email },
        {
          resetOtp: otp,
          resetOtpExpireAt: expireAt,
        }
      );

      const context = {
        domain: process.env.CLIENT_URL,
        otp: otp,
      };
      sendEmail(
        email,
        "Solicitud de cambio de correo",
        "changeEmailTemplate",
        context
      );

      return {
        message: `Se ha enviado un correo a ${newEmail} con instrucciones para confirmar el cambio de correo.`,
      };
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }

  //!Nueva funcion
  //todo: revisar el flujo del cambio de correo
  async changeEmail(userId, newEmail) {
    try {
      const userFound = await User.findById(userId);

      if (!userFound) {
        throw {
          status: 404,
          userErrorMessage: "Usuario no encontrado.",
        };
      }

      const emailFound = await User.findOne({ email: newEmail });

      if (emailFound) {
        throw {
          status: 409,
          userErrorMessage:
            "La direccion de correo proporcionada ya esta en uso.",
        };
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      const expireAt = Date.now() + 15 * 60 * 1000;

      await User.findOneAndUpdate(
        { _id: userId },
        {
          verifyOtp: otp,
          verifyOtpExpireAt: expireAt,
        }
      );

      const context = {
        domain: process.env.CLIENT_URL,
        otp: otp,
      };

      sendEmail(email, "Confirma tu cuenta", "confirmAccountTemplate", context);

      return {
        message: "Correo actualizado exitosamente.",
      };
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }
}

export default new UserService();
