import bcrypt from "bcryptjs";

import User from "../database/models/user.model.js";
import City from "../database/models/city.model.js";

import "../database/models/state.model.js";
import "../database/models/country.model.js";

import { sendEmail } from "../libs/sendEmail.js";

class UserService {
  async getProfile(userId) {
    try {
      const userFound = await User.findById(userId)
        .select(
          "-password -email_verify_otp -email_verify_otp_expire_at -is_email_verified -password_reset_otp -password_reset_otp_expire_at -__v"
        )
        .populate({
          path: "city_id",
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
        _id: userFound._id,
        first_name: userFound.first_name,
        last_name: userFound.last_name,
        date_of_birth: userFound.date,
        gender: userFound.gender,
        location: {
          country: userFound.city_id?.state_id?.country_id?.name,
          state: userFound.city_id?.state_id?.name,
          city: userFound.city_id?.name,
        },
        ci: userFound.ci,
        phone_number: userFound.phone_number,
        email: userFound.email,
        createAt: userFound.createdAt,
        updateAt: userFound.updatedAt,
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

  //!EN REVISION
  async updateProfile(userId, userData) {
    try {
      const cityFound = await City.findById(userData.city_id);

      if (!cityFound) {
        throw {
          status: 404,
          userErrorMessage:
            "No se encontro la ciudad proporcionada. Por favor, verifique la ciudad.",
        };
      }

      const updatedUser = await User.findByIdAndUpdate(
        { _id: userId },
        {
          first_name: userData.first_name,
          last_name: userData.last_name,
          date_of_birth: userData.date_of_birth,
          gender: userData.gender,
          city_id: userData.city_id,
          ci: userData.ci,
          phone_number: userData.phone_number,
        },
        {
          new: true,
        }
      )
        .select(
          "-password -email_verify_otp -email_verify_otp_expire_at -is_email_verified -password_reset_otp -password_reset_otp_expire_at -__v"
        )
        .lean();

      if (!updatedUser) {
        throw {
          status: 404,
          userErrorMessage: "Usuario no encontrado.",
        };
      }

      return {
        message: "Informacion actualizada exitosamente.",
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

export default new UserService();
