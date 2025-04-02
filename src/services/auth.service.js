import bcrypt from "bcryptjs";

import User from "../database/models/user.model.js";
import Session from "../database/models/session.model.js";

import { createAccessToken } from "../libs/createAccessToken.js";
import { sendEmail } from "../libs/sendEmail.js";

class AuthService {
  async signUp(userData) {
    try {
      const { email, password } = userData;

      const userFound = await User.findOne({ email });

      if (userFound) {
        throw {
          status: 409,
          userErrorMessage:
            "La direccion de correo proporcionada ya esta en uso",
        };
      }

      if (userData.password !== userData.confirmPassword) {
        throw {
          status: 401,
          userErrorMessage: "Las contraseñas no coinciden",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000);
      const expireAt = Date.now() + 15 * 60 * 1000;

      const newUser = new User({
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: email,
        password: passwordHash,
        verifyOtp: otp,
        verifyOtpExpireAt: expireAt,
      });

      await newUser.save();

      const context = {
        domain: process.env.CLIENT_URL,
        otp: otp,
      };

      sendEmail(email, "Confirma tu cuenta", "confirmAccountTemplate", context);

      return {
        message: `Correo de confirmacion enviado exitosamente a ${email}`,
      };
    } catch (error) {
      console.log(error);
      throw {
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
          userErrorMessage: "Usuario no encontrado",
        };
      }

      if (userFound.verifyOtp !== otp) {
        throw {
          status: 401,
          userErrorMessage: "El OTP proporcionado no es correcto",
        };
      }

      if (Date.now() > userFound.verifyOtpExpireAt) {
        throw {
          status: 401,
          userErrorMessage: "El OTP ha expirado",
        };
      }

      await User.findOneAndUpdate(
        { email },
        {
          isAccountVerified: true,
          verifyOtp: null,
          verifyOtpExpireAt: null,
        }
      );

      return { message: "Cuenta verificada exitosamente" };
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }

  async signIn(email, password) {
    try {
      const userFound = await User.findOne({ email });

      if (!userFound) {
        throw {
          status: 404,
          userErrorMessage: "No hay ningun usuario registrado con este correo",
        };
      }

      if (!userFound.isAccountVerified) {
        throw {
          status: 401,
          userErrorMessage: "La cuenta no ha sido verificada",
        };
      }

      const isMarched = await bcrypt.compare(password, userFound.password);

      if (!isMarched) {
        throw {
          status: 401,
          userErrorMessage: "La contraseña es incorrecta",
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
        message: `Bienvenido de nuevo ${userFound.username}`,
        data: authToken,
      };
    } catch (error) {
      console.log(error);
      throw { message: error.userErrorMessage };
    }
  }

  async forgotPassword(email) {
    try {
      const userFound = await User.findOne({ email });

      if (!userFound) {
        throw {
          status: 500,
          userErrorMessage: "Verifique la direccion de correo proporcionada",
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
        message: `Correo de recuperacion enviado exitosamente a ${email}`,
      };
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }

  async resetPassword(email, otp, newPassword, confirmPassword) {
    try {
      const userFound = await User.findOne({ email });

      if (!userFound) {
        throw {
          status: 404,
          userErrorMessage: "Usuario no encontrado",
        };
      }

      if (newPassword !== confirmPassword) {
        throw {
          status: 401,
          userErrorMessage: "Las contraseñas no coinciden",
        };
      }

      if (userFound.resetOtp !== otp) {
        throw {
          status: 401,
          userErrorMessage: "El OTP proporcionado no es correcto",
        };
      }

      if (Date.now() > userFound.resetOtpExpireAt) {
        throw {
          status: 401,
          userErrorMessage: "El OTP ha expirado",
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
        message: "Contraseña actualizada exitosamente",
      };
    } catch (error) {
      console.log(error);
      throw {
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
        message: "Sesion activa",
        data: userFound.username,
      };
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }

  async signOut(authToken) {
    try {
      await Session.findOneAndDelete({ auth_token: authToken });
      return {
        message: "Sesion cerrada exitosamente",
      };
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }
}

export default new AuthService();
