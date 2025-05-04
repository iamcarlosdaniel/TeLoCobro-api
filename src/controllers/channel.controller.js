import channelService from "../services/channel.service.js";

class ChannelController {
  async getMyChannel(req, res) {
    try {
      const response = await channelService.getMyChannel(req.authData.id);

      return res.status(200).json(response);
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

  async activateMyChannel(req, res) {
    try {
      const response = await channelService.activateMyChannel(req.authData.id);

      return res.status(200).json(response);
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
  async deactivateMyChannel(req, res) {
    try {
      const response = await channelService.deactivateMyChannel(
        req.authData.id
      );

      return res.status(200).json(response);
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
