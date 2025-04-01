import AuthService from "../services/auth.service.js";

class AuthController {
  async signUp(req, res) {
    try {
      const userData = req.body;
      const response = await AuthService.signUp(userData);

      res.status(200).send({
        status: "OK",
        data: {
          message: response.message,
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

  async confirmAccount(req, res) {
    try {
      const { email, otp } = req.body;
      const response = await AuthService.confirmAccount(email, otp);

      res.status(200).send({
        status: "OK",
        data: {
          message: response.message,
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
                "An error occurred while processing your request. Please try again later.",
            },
          ],
        },
      });
    }
  }

  async signIn(req, res) {
    try {
      const { email, password } = req.body;
      const response = await AuthService.signIn(email, password);

      res.cookie("authToken", response.data, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(200).send({
        status: "OK",
        data: {
          message: response.message,
          authToken: response.data,
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
                "An error occurred while processing your request. Please try again later.",
            },
          ],
        },
      });
    }
  }

  async signOut(req, res) {
    try {
      const authToken =
        req.cookies?.authToken || req.headers["authorization"]?.split(" ")[1];
      const response = await AuthService.signOut(authToken);

      res.clearCookie("authToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(200).send({
        status: "OK",
        data: {
          message: response.message,
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
                "An error occurred while processing your request. Please try again later.",
            },
          ],
        },
      });
    }
  }
}

export default new AuthController();
