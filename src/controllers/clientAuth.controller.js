import clientAuthService from "../services/clientAuth.service.js";

class ClientAuthController {
  async getCompaniesWithMyEmail(req, res) {
    try {
      const { email } = req.body;
      const response = await clientAuthService.getCompaniesWithMyEmail(email);

      res.status(200).send({
        status: "OK",
        data: response,
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        message: error.message || "Internal Server Error",
      });
    }
  }
  async requestAccess(req, res) {
    try {
      const clientId = req.params.id;
      const response = await clientAuthService.requestAccess(clientId);

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

  async signIn(req, res) {
    try {
      const clientId = req.params.id;
      const { otp } = req.body;
      const response = await clientAuthService.signIn(clientId, otp);

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

  async authStatus(req, res) {
    try {
      const clientId = req.authData.id;
      const response = await clientAuthService.authStatus(clientId);

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

  async signOut(req, res) {
    try {
      const clientId = req.authData.id;
      const response = await clientAuthService.signOut(clientId);

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

export default new ClientAuthController();
