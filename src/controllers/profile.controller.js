import profileService from "../services/profile.service.js";

class ProfileController {
  async getProfile(req, res) {
    try {
      const userId = req.authData.id;
      const response = await profileService.getProfile(userId);
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

  async updateProfile(req, res) {
    try {
      const userId = req.authData.id;
      const userData = req.body;
      const response = await profileService.updateProfile(userId, userData);
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

  async changeEmail(req, res) {
    try {
      const { userData, newEmail } = req.body;
      const response = await profileService.emailChangeRequest(
        userData,
        newEmail
      );

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

  async confirmEmail(req, res) {
    try {
      const userId = req.authData.id;
      const { otp, new_email } = req.body;
      const response = await profileService.confirmEmailChange(
        userId,
        otp,
        new_email
      );

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

  async changePassword(req, res) {
    try {
      const userId = req.authData.id;
      const { password, new_password } = req.body;
      const response = await profileService.changePassword(
        userId,
        password,
        new_password
      );

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

export default new ProfileController();
