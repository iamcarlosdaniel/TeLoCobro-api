import { title } from "process";
import Channel from "../database/models/channel.model.js";

class ChannelService {
  async getAllMyChannels(userId) {
    try {
      const channels = await Channel.find({ user_id: userId }).populate(
        "members",
        "_id username email"
      );

      return {
        message: "Canales encontrados",
        data: channels,
      };
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }

  async getChannelById(userId, channelId) {
    try {
      const channel = await Channel.findOne({
        _id: channelId,
        user_id: userId,
      }).populate("members", "_id username email");
      return {
        message: "Canal encontrado",
        data: channel,
      };
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }

  async createChannel(userId, channelData) {
    try {
      const channel = await Channel.create({
        user_id: userId,
        title: channelData.title,
        description: channelData.description,
      });
      await channel.save();
      return {
        message: "Canal creado correctamente",
      };
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }

  async updateChannelInformation(userId, channelId, channelData) {
    try {
      const channel = await Channel.findOneAndUpdate(
        {
          _id: channelId,
          user_id: userId,
        },
        {
          title: channelData.title,
          description: channelData.description,
        },
        { new: true }
      ).populate("members", "_id username email");

      return {
        message: "Canal editado correctamente",
        data: channel,
      };
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }

  async deleteChannel(userId, channelId) {
    try {
      await Channel.findOneAndDelete({
        _id: channelId,
        user_id: userId,
      });
      return {
        message: "Canal eliminado correctamente",
      };
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }

  //todo: ver si es correcto el buscar el usuario que se quiere anadir al canal en esta funcion
  async addMemberToChannel(adminUserId, channelId, membersEmail) {
    try {
      const channelFound = await Channel.findOne({
        _id: channelId,
        admin_user_id: adminUserId,
      });

      if (!channelFound) {
        throw {
          status: 404,
          userErrorMessage: "No se ha encontrado el canal",
        };
      }

      await Channel.findOneAndUpdate(
        {
          _id: channelId,
          admin_user_id: adminUserId,
        },
        {
          $addToSet: { members: membersEmail },
        },
        { new: true }
      ).populate("members", "_id username email");

      return {
        message: "Miembro agregado correctamente",
        data: channel,
      };
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }
}

export default new ChannelService();
