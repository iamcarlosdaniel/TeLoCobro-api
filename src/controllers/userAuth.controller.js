import UserAuthService from "../services/userAuth.service.js";

class UserAuthController {
  async signUp(req, res) {
    try {
      const userData = req.body;
      const response = await UserAuthService.signUp(userData);

      res.status(200).send({
        status: "OK",
        data: response,
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

  async confirmAccount(req, res) {
    try {
      const { email, otp } = req.body;
      const response = await UserAuthService.confirmAccount(email, otp);

      res.status(200).send({
        status: "OK",
        data: response,
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

  async signIn(req, res) {
    try {
      const { email, password } = req.body;
      const response = await UserAuthService.signIn(email, password);

      res.cookie("auth_token", response.auth_token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(200).send({
        status: "OK",
        data: response,
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

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const response = await UserAuthService.forgotPassword(email);

      res.status(200).send({
        status: "OK",
        data: response,
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

  async resetPassword(req, res) {
    try {
      const { email, otp, new_password } = req.body;
      const response = await UserAuthService.resetPassword(
        email,
        otp,
        new_password
      );

      res.status(200).send({
        status: "OK",
        data: response,
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

  async authStatus(req, res) {
    try {
      const response = await UserAuthService.authStatus(req.authData.id);

      res.status(200).send({
        status: "OK",
        data: response,
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

  async signOut(req, res) {
    try {
      const authToken =
        req.cookies?.auth_token || req.headers["authorization"]?.split(" ")[1];
      const response = await UserAuthService.signOut(authToken);

      res.clearCookie("auth_token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(200).send({
        status: "OK",
        data: response,
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

export default new UserAuthController();
