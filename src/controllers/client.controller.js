import clientService from "../services/client.service.js";

class ClientController {
  async getMyClientById(req, res) {
    try {
      const response = await clientService.getMyClientById(
        req.authData.id,
        req.params.id
      );
      res.status(200).send({
        status: "OK",
        data: response,
      });
    } catch (error) {
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

  async getAllMyClients(req, res) {
    try {
      const response = await clientService.getAllMyClients(req.authData.id);
      res.status(200).send({
        status: "OK",
        data: response,
      });
    } catch (error) {
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

  async uploadClients(req, res) {
    try {
      const response = await clientService.uploadClients(
        req.authData.id,
        req.file
      );
      res.status(200).send({
        status: "OK",
        data: response,
      });
    } catch (error) {
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

  async getProfile(req, res) {
    try {
      const response = await clientService.getProfile(req.authData.id);
      res.status(200).send({
        status: "OK",
        data: response,
      });
    } catch (error) {
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

export default new ClientController();
