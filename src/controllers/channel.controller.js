import channelService from "../services/channel.service.js";

class ChannelController {
  async createChannel(req, res) {
    try {
      const userId = req.authData.id;
      const channelData = req.body;
      const channel = await channelService.createChannel(userId, channelData);

      res.status(200).send({
        status: "OK",
        data: {
          channel,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(error?.status || 500).send({
        status: "FAILED",
        data: {
          error: [
            {
              message:
                error?.message ||
                "Ocurrio un error al procesar su solicitud. Por favor intente de nuevo mas tarde.",
            },
          ],
        },
      });
    }
  }

  async getAllMyChannels(req, res) {
    try {
      const userId = req.authData.id;
      const channels = await channelService.getAllMyChannels(userId);

      res.status(200).send({
        status: "OK",
        data: {
          channels,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(error?.status || 500).send({
        status: "FAILED",
        data: {
          error: [
            {
              message:
                error?.message ||
                "Ocurrio un error al procesar su solicitud. Por favor intente de nuevo mas tarde.",
            },
          ],
        },
      });
    }
  }
}

export default new ChannelController();
