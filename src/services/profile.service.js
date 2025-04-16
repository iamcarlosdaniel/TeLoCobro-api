import User from "../database/models/user.model.js";

class ProfileService {
  async getProfile(userId) {
    try {
      const userFound = await User.findById(userId).select("-password -__v");

      if (!userFound) {
        throw {
          status: 404,
          userErrorMessage: "Usuario no encontrado.",
        };
      }

      return {
        message: "Informacion obtenida exitosamente.",
        user: userFound,
      };
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }

  async updateProfile(userId, userData) {
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

  async changeEmail(userId, password, newEmail) {
    try {
      const userFound = await User.findById(userId).select("__v");

      if (!userFound) {
        throw {
          status: 404,
          userErrorMessage: "Usuario no encontrado.",
        };
      }

      const isMarched = await bcrypt.compare(password, userFound.password);

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
        newEmail,
        "Solicitud de cambio de correo",
        "changeEmailRequestTemplate",
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
  async confirmEmail(userId, otp, newEmail) {
    try {
      const userFound = await User.findById(userId).select("__v");

      if (!userFound) {
        throw {
          status: 404,
          userErrorMessage: "Usuario no encontrado.",
        };
      }

      if (userFound.resetOtp !== otp) {
        throw {
          status: 403,
          userErrorMessage:
            "El código de verificación proporcionado no es correcto.",
        };
      }

      const currentDate = Date.now();

      if (userFound.resetOtpExpireAt < currentDate) {
        throw {
          status: 403,
          userErrorMessage: "El código de verificación ha expirado.",
        };
      }

      await User.findByIdAndUpdate(userId, {
        email: newEmail,
        resetOtp: null,
        resetOtpExpireAt: null,
      });

      return {
        message: "Correo actualizado exitosamente.",
      };
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }

  async changePassword(userId, password, newPassword) {
    try {
      const userFound = await User.findById(userId).select("__v");

      if (!userFound) {
        throw {
          status: 404,
          userErrorMessage: "Usuario no encontrado.",
        };
      }

      const isMarched = await bcrypt.compare(password, userFound.password);

      if (!isMarched) {
        throw {
          status: 403,
          userErrorMessage: "La contraseña es incorrecta.",
        };
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);

      await User.findByIdAndUpdate(userId, {
        password: passwordHash,
      });

      return {
        message: "Contraseña actualizada exitosamente.",
      };
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }
}

export default new ProfileService();
