import bcrypt from "bcryptjs";

import User from "../database/models/user.model.js";
import City from "../database/models/city.model.js";
import Session from "../database/models/session.model.js";

import "../database/models/state.model.js";
import "../database/models/country.model.js";

import { createAccessToken } from "../libs/createAccessToken.js";
import { createOTP } from "../libs/createOneTimePassword.js";
import { sendEmail } from "../libs/sendEmail.js";

class UserAuthService {
  async signUp(userData) {
    try {
      const { email } = userData;
      const userFoundByEmail = await User.findOne({ email });

      if (userFoundByEmail) {
        throw {
          status: 409,
          userErrorMessage:
            "La direccion de correo proporcionada ya esta en uso.",
        };
      }

      const cityFound = await City.findById(userData.city_id).populate({
        path: "state_id",
        populate: {
          path: "country_id",
        },
      });

      if (!cityFound) {
        throw {
          status: 404,
          userErrorMessage:
            "No se encontro la ciudad proporcionada. Por favor, verifique la ciudad.",
        };
      }

      const phone_code = cityFound.state_id.country_id.phone_code;
      const passwordHash = await bcrypt.hash(userData.password, 10);
      const { otp, expireAt } = await createOTP(100000, 999999, 3);

      const newUser = new User({
        ...userData,
        phone_number: phone_code + userData.phone_number,
        password: passwordHash,
        email_verify_otp: otp,
        email_verify_otp_expire_at: expireAt,
      });

      const context = {
        domain: process.env.CLIENT_URL,
        otp: otp,
      };

      sendEmail(email, "Confirma tu cuenta", "confirmAccountTemplate", context);

      await newUser.save();

      return {
        message: `Correo de confirmacion enviado exitosamente a ${email}.`,
        user: {
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

  async confirmAccount(email, otp) {
    try {
      const userFound = await User.findOne({ email });

      if (!userFound) {
        throw {
          status: 404,
          userErrorMessage:
            "El correo proporcionado no es correcto o no esta asociado a ningun usuario.",
        };
      }

      if (userFound.email_verify_otp !== otp) {
        throw {
          status: 401,
          userErrorMessage:
            "El código de verificación proporcionado no es correcto.",
        };
      }

      if (Date.now() > userFound.email_verify_otp_expire_at) {
        throw {
          status: 401,
          userErrorMessage: "El código de verificación ha expirado.",
        };
      }

      await User.findOneAndUpdate(
        { email },
        {
          email_verify_otp: null,
          email_verify_otp_expired_at: null,
          is_email_verified: true,
        },
        { new: true }
      );

      const context = {
        domain: process.env.CLIENT_URL,
      };

      sendEmail(email, "Bienvenido a TeLoCobro", "welcomeTemplate", context);

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
        },
        "7d"
      );

      const newSession = new Session({
        user_type: "user",
        user_id: userFound._id,
        device_type: "web",
        auth_token: authToken,
      });

      await newSession.save();

      return {
        message: `Bienvenido de nuevo ${userFound.first_name}`,
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

  async forgotPassword(email) {
    try {
      const userFound = await User.findOne({
        email,
      });

      if (!userFound) {
        throw {
          status: 404,
          userErrorMessage: "Verifique la direccion de correo proporcionada.",
        };
      }

      const { otp, expireAt } = await createOTP(100000, 999999, 3);

      await User.findOneAndUpdate(
        { email },
        {
          password_reset_otp: otp,
          password_reset_otp_expire_at: expireAt,
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
      });

      console.log(userFound);

      if (!userFound) {
        throw {
          status: 404,
          userErrorMessage: "Usuario no encontrado.",
        };
      }

      if (userFound.password_reset_otp !== otp) {
        throw {
          status: 401,
          userErrorMessage:
            "El código de verificación proporcionado no es correcto.",
        };
      }

      if (Date.now() > userFound.password_reset_otp_expire_at) {
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
          password_reset_otp: null,
          password_reset_otp_expire_at: null,
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
        "_id first_name last_name date_of_birth gender ci phone_number email"
      );

      return {
        message: "Sesion activa.",
        user: userFound,
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

export default new UserAuthService();
