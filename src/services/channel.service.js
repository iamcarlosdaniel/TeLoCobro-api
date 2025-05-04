import Channel from "../database/models/channel.model.js";
import Company from "../database/models/company.model.js";

class ChannelService {
  async getMyChannel(userId) {
    try {
      const companyFound = await Company.findOne({ user_id: userId });

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes una empresa registrada.",
        };
      }

      const channelFound = await Channel.findOne({
        company_id: companyFound.id,
      });

      if (companyFound.user_id.toString() !== userId) {
        throw {
          status: 403,
          userErrorMessage: "No tienes permisos para acceder a este canal.",
        };
      }

      return {
        message: "Información obtenida exitosamente.",
        data: channelFound,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async activateMyChannel(userId) {
    try {
      const companyFound = await Company.findOne({ user_id: userId });

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes una empresa registrada.",
        };
      }

      if (companyFound.user_id.toString() !== userId) {
        throw {
          status: 403,
          userErrorMessage: "No tienes permisos para acceder a este canal.",
        };
      }

      await Channel.findOneAndUpdate(
        { company_id: companyFound._id },
        { status: "active" },
        { new: true }
      );

      return {
        message: "Canal activado exitosamente.",
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async deactivateMyChannel(userId) {
    try {
      const companyFound = await Company.findOne({ user_id: userId });

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes una empresa registrada.",
        };
      }

      if (companyFound.user_id.toString() !== userId) {
        throw {
          status: 403,
          userErrorMessage: "No tienes permisos para acceder a este canal.",
        };
      }

      await Channel.findOneAndUpdate(
        { company_id: companyFound._id },
        { status: "inactive" },
        { new: true }
      );

      return {
        message: "Canal desactivado exitosamente.",
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

export default new ChannelService();
