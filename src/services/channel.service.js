import Channel from "../database/models/channel.model.js";

class ChannelService {
  async createChannel(userId, channelData) {
    try {
      const channel = await Channel.create({
        user_id: userId,
        ...channelData,
      });

      return channel;
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }

  async getAllMyChannels(userId) {
    try {
      const channels = await Channel.find({ user_id: userId }).populate(
        "members",
        "_id username email"
      );

      return channels;
    } catch (error) {
      throw {
        message: error.userErrorMessage,
      };
    }
  }
}

export default new ChannelService();
