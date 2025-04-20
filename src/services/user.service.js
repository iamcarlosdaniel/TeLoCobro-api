import bcrypt from "bcryptjs";

import User from "../database/models/user.model.js";

import "../database/models/city.model.js";
import "../database/models/state.model.js";
import "../database/models/country.model.js";

import { sendEmail } from "../libs/sendEmail.js";

class UserService {
  async getProfile(userId) {
    try {
      const userFound = await User.findById(userId)
        .select("-password -__v -account_verification")
        .populate({
          path: "location.city_id",
          select: "-__v -createdAt -updatedAt -is_allowed",
          populate: {
            path: "state_id",
            select: "-__v -createdAt -updatedAt -is_allowed",
            populate: {
              path: "country_id",
              select: "-__v -createdAt -updatedAt -is_allowed",
            },
          },
        })
        .lean();

      if (!userFound) {
        throw {
          status: 404,
          userErrorMessage: "Usuario no encontrado.",
        };
      }

      const user = {
        ...userFound,
        location: {
          country: userFound.location.city_id?.state_id?.country_id?.name,
          state: userFound.location.city_id?.state_id?.name,
          city: userFound.location.city_id?.name,
        },
      };

      return {
        message: "Información obtenida exitosamente.",
        user: user,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
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
          ...userData,
        },
        {
          new: true,
        }
      )
        .select("-password -__v")
        .lean();

      return {
        message: "Informacion actualizada exitosamente.",
        data: updatedUser,
      };
    } catch (error) {
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async changeEmail(userId, password, newEmail) {
    try {
      const userFound = await User.findById(userId);

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
        { _id: userId },
        {
          account_verification: {
            is_account_verified: true,
            verify_otp: otp,
            verify_otp_expire_at: expireAt,
          },
        }
      );

      const context = {
        domain: process.env.CLIENT_URL,
        otp: otp,
      };
      sendEmail(
        newEmail,
        "Solicitud de cambio de correo",
        "confirmEmailTemplate",
        context
      );

      return {
        message: `Se ha enviado un correo a ${newEmail} con instrucciones para confirmar el cambio de correo.`,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  //!Nueva funcion
  //todo: revisar el flujo del cambio de correo
  async confirmEmail(userId, otp, newEmail) {
    try {
      const userFound = await User.findById(userId);

      if (!userFound) {
        throw {
          status: 404,
          userErrorMessage: "Usuario no encontrado.",
        };
      }

      if (userFound.account_verification.verify_otp !== otp) {
        throw {
          status: 403,
          userErrorMessage:
            "El código de verificación proporcionado no es correcto.",
        };
      }

      const currentDate = Date.now();

      if (userFound.account_verification.verify_otp_expire_at < currentDate) {
        throw {
          status: 403,
          userErrorMessage: "El código de verificación ha expirado.",
        };
      }

      await User.findByIdAndUpdate(userId, {
        email: newEmail,
        account_verification: {
          is_account_verified: true,
          verify_otp: null,
          verify_otp_expire_at: null,
        },
      });

      return {
        message: "Correo actualizado exitosamente.",
      };
    } catch (error) {
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async changePassword(userId, password, newPassword) {
    try {
      const userFound = await User.findById(userId);

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
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }
}

export default new UserService();
