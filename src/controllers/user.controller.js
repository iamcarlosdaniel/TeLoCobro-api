import userService from "../services/user.service.js";

class UserController {
  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await userService.getUserById(userId);
      res.status(200).send({
        status: "OK",
        data: {
          user,
        },
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

  async emailChangeRequest(req, res) {
    try {
      const { userData, newEmail } = req.body;
      const response = await userService.emailChangeRequest(userData, newEmail);

      res.status(200).send({
        status: "OK",
        data: {
          message: response.message,
        },
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
