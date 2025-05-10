import userService from "../services/user.service.js";

class UserController {
  async getProfile(req, res) {
    try {
      const userId = req.authUserData.id;
      const response = await userService.getProfile(userId);
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

  async updateProfile(req, res) {
    try {
      const userId = req.authData.id;
      const userData = req.body;
      const response = await userService.updateProfile(userId, userData);
      res.status(200).send({
        status: "OK",
        data: response.message,
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

export default new UserController();
