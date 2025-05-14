import clientAuthService from "../services/clientAuth.service.js";

class ClientAuthController {
  async requestAccess(req, res) {
    try {
      const { email } = req.body;
      const response = await clientAuthService.requestAccess(email);

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

  async signIn(req, res) {
    try {
      const { email, otp } = req.body;
      const response = await clientAuthService.signIn(email, otp);

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

  async authStatus(req, res) {
    try {
      const response = await clientAuthService.authStatus(req.authData.id);

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

  async signOut(req, res) {
    try {
      const { clientId } = req.authData.id;
      const response = await clientAuthService.signOut(clientId);

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
}

export default new ClientAuthController();
