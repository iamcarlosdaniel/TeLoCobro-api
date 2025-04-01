import jwt from "jsonwebtoken";
import Session from "../database/models/session.model.js";
import { JWT_SECRET } from "../config.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const { auth_token } = req.cookies;

    if (!auth_token) {
      return res.status(401).send({
        status: "FAILED",
        data: { error: [{ message: "Por favor, vuelve a iniciar sesion." }] },
      });
    }

    const sessionFound = await Session.findOne({ access_token: auth_token });

    if (!sessionFound) {
      return res.status(401).send({
        status: "FAILED",
        data: { error: [{ message: "Por favor, vuelve a iniciar sesion" }] },
      });
    }

    jwt.verify(auth_token, JWT_SECRET, (error, authData) => {
      if (error) {
        return res.status(401).send({
          status: "FAILED",
          data: { error: [{ message: "Tu llave de acceso no es valida" }] },
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
