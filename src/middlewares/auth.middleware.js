import jwt from "jsonwebtoken";
import Session from "../database/models/session.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authToken =
      req.cookies?.auth_token ||
      (req.headers["authorization"] &&
      req.headers["authorization"].startsWith("Bearer ")
        ? req.headers["authorization"].split("Bearer ")[1].trim()
        : null);

    if (!authToken) {
      console.log("No hay token de acceso en la cookie");
      return res.status(401).send({
        status: "FAILED",
        data: { error: [{ message: "Por favor, vuelve a iniciar sesión." }] },
      });
    }

    const sessionFound = await Session.findOne({ auth_token: authToken });

    if (!sessionFound) {
      console.log("No hay una sesion activa para este token de acceso");
      return res.status(401).send({
        status: "FAILED",
        data: { error: [{ message: "Por favor, vuelve a iniciar sesión." }] },
      });
    }

    jwt.verify(authToken, process.env.JWT_SECRET, (error, authData) => {
      if (error) {
        return res.status(401).send({
          status: "FAILED",
          data: {
            error: [
              {
                message:
                  "Tu llave de acceso no es válida. Por favor, vuelve a iniciar sesión.",
              },
            ],
          },
        });
      }
      req.authData = authData;
      next();
    });
  } catch (error) {
    return res.status(error?.status || 500).send({
      status: "FAILED",
      data: {
        error:
          "Tenemos problemas para procesar tu solicitud. Intentalo mas tarde.",
      },
    });
  }
};
