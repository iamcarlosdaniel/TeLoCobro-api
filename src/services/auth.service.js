import bcrypt from "bcryptjs";

import User from "../database/models/user.model.js";
import City from "../database/models/city.model.js";
import Session from "../database/models/session.model.js";

import "../database/models/state.model.js";
import "../database/models/country.model.js";

import { createAccessToken } from "../libs/createAccessToken.js";
import { sendEmail } from "../libs/sendEmail.js";

//!No utilizar
import { sendWhatsAppMessage } from "../libs/sendWhatsappMessage.js";

class AuthService {
  async signUp(userData) {
    try {
      const { email, password } = userData;

      const userFoundByEmail = await User.findOne({
        email,
        "account_verification.is_account_verified": true,
      });

      console.log(userFoundByEmail);
      if (userFoundByEmail) {
        throw {
          status: 409,
          userErrorMessage:
            "La direccion de correo proporcionada ya esta en uso.",
        };
      }

      const userFoundByUsername = await User.findOne({
        username: userData.username,
        "account_verification.is_account_verified": true,
      });

      if (userFoundByUsername) {
        throw {
          status: 409,
          userErrorMessage: "El nombre de usuario ya esta en uso.",
        };
      }

      const cityFound = await City.findById(userData.location.city_id).populate(
        {
          path: "state_id",
          populate: {
            path: "country_id",
          },
        }
      );

      if (!cityFound) {
        throw {
          status: 404,
          userErrorMessage:
            "No se encontro la ciudad proporcionada. Por favor, verifique la ciudad.",
        };
      }

      console.log(cityFound.state_id.country_id.phone_code);

      const passwordHash = await bcrypt.hash(password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000);
      const expireAt = Date.now() + 15 * 60 * 1000;

      const newUser = new User({
        ...userData,
        phone_number: `${cityFound.state_id.country_id.phone_code}${userData.phone_number}`,
        password: passwordHash,
        account_verification: {
          verify_otp: otp,
          verify_otp_expire_at: expireAt,
        },
      });

      await newUser.save();

      const context = {
        domain: process.env.CLIENT_URL,
        otp: otp,
      };

      sendEmail(email, "Confirma tu cuenta", "confirmAccountTemplate", context);

      return {
        message: `Correo de confirmacion enviado exitosamente a ${email}.`,
        data: {
          user_id: newUser._id,
          email: newUser.email,
        },
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  //async confirmPhoneNumber(phoneNumber) {
  //!No disponible por el momento
  //}

  async confirmAccount(userId, email, otp) {
    try {
      const userFound = await User.findOne({ _id: userId, email });

      if (!userFound) {
        throw {
          status: 404,
          userErrorMessage:
            "El correo proporcionado no es correcto o no esta asociado a ningun usuario.",
        };
      }

      if (userFound.account_verification.verify_otp !== otp) {
        throw {
          status: 401,
          userErrorMessage:
            "El código de verificación proporcionado no es correcto.",
        };
      }

      if (Date.now() > userFound.account_verification.verify_otp_expire_at) {
        throw {
          status: 401,
          userErrorMessage: "El código de verificación ha expirado.",
        };
      }

      await User.findOneAndUpdate(
        { _id: userId, email },
        {
          account_verification: {
            is_account_verified: true,
            verify_otp: null,
            verify_otp_expire_at: null,
          },
        }
      );

      return { message: "Cuenta verificada exitosamente." };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async signIn(email, password) {
    try {
      const userFound = await User.findOne({
        email,
        "account_verification.is_account_verified": true,
      });

      if (!userFound) {
        throw {
          status: 404,
          userErrorMessage:
            "El correo proporcionado no está asociado a ningún usuario registrado.",
        };
      }

      const isMarched = await bcrypt.compare(password, userFound.password);

      if (!isMarched) {
        throw {
          status: 401,
          userErrorMessage: "La contraseña es incorrecta.",
        };
      }

      const authToken = await createAccessToken(
        {
          id: userFound._id,
          username: userFound.username,
        },
        "7d"
      );

      const newSession = new Session({
        user_id: userFound._id,
        auth_token: authToken,
      });

      await newSession.save();

      return {
        message: `Bienvenido de nuevo ${userFound.username}.`,
        data: authToken,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async forgotPassword(email) {
    try {
      const userFound = await User.findOne({ email });

      if (!userFound) {
        throw {
          status: 404,
          userErrorMessage: "Verifique la direccion de correo proporcionada.",
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
        "Recupera tu contraseña",
        "forgotPasswordTemplate",
        context
      );

      return {
        message: `Correo de recuperacion enviado exitosamente a ${email}.`,
      };
    } catch (error) {
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async resetPassword(email, otp, newPassword) {
    try {
      const userFound = await User.findOne({
        email,
        "account_verification.is_account_verified": true,
      });

      if (!userFound) {
        throw {
          status: 404,
          userErrorMessage: "Usuario no encontrado.",
        };
      }

      if (userFound.resetOtp !== otp) {
        throw {
          status: 401,
          userErrorMessage:
            "El código de verificación proporcionado no es correcto.",
        };
      }

      if (Date.now() > userFound.resetOtpExpireAt) {
        throw {
          status: 401,
          userErrorMessage: "El código de verificación ha expirado.",
        };
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);

      await User.findOneAndUpdate(
        { email },
        {
          password: passwordHash,
          resetOtp: null,
          resetOtpExpireAt: null,
        }
      );

      return {
        message: "Contraseña actualizada exitosamente.",
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async authStatus(userId) {
    try {
      const userFound = await User.findById(userId).select(
        "_id username email"
      );

      return {
        message: "Sesion activa.",
        user: {
          username: userFound.username,
        },
      };
    } catch (error) {
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async signOut(authToken) {
    try {
      await Session.findOneAndDelete({ auth_token: authToken });
      return {
        message: "Sesion cerrada exitosamente.",
      };
    } catch (error) {
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }
}

export default new AuthService();
