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
        throw new Error("La direccion de correo proporcionada ya esta en uso");
      }

      if (userData.password !== userData.confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
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
      throw new Error("Ocurrio un error al registrar el usuario");
    }
  }

  async confirmAccount(email, otp) {
    try {
      const userFound = await User.findOne({ email });

      if (!userFound) {
        throw {
          status: 404,
          message: "Usuario no encontrado",
        };
      }

      if (userFound.verifyOtp !== otp) {
        throw {
          status: 401,
          message: "El OTP proporcionado no es correcto",
        };
      }

      if (Date.now() > userFound.verifyOtpExpireAt) {
        throw {
          status: 401,
          message: "El OTP ha expirado",
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
      throw new Error(error);
    }
  }

  async signIn(email, password) {
    try {
      const userFound = await User.findOne({ email });

      if (!userFound) {
        throw {
          status: 404,
          message: "No hay ningun usuario registrado con este correo",
        };
      }

      if (!userFound.isAccountVerified) {
        throw {
          status: 401,
          message: "La cuenta no ha sido verificada",
        };
      }

      const isMarched = await bcrypt.compare(password, userFound.password);

      if (!isMarched) {
        throw {
          status: 401,
          message: "La contraseña es incorrecta",
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
      throw { message: error.message };
    }
  }

  async forgotPaaword(email) {
    try {
      const userFound = await User.findOne({ email });

      if (!userFound) {
        throw {
          status: 500,
          message: "Error al intentar restablecer la contrasena",
        };
      }
    } catch (error) {
      throw {
        message: error.message,
      };
    }
  }

  async resetPassword(data) {
    try {
    } catch (error) {
      throw {
        message: error.message,
      };
    }
  }

  async authStatus() {
    try {
    } catch (error) {
      throw {
        message: error.message,
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
        message: error.message,
      };
    }
  }
}

export default new AuthService();
