import jwt from "jsonwebtoken";
import Session from "../database/models/session.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const { auth_token } = req.cookies;

    if (!auth_token) {
      console.log("No hay token de acceso en la cookie");
      return res.status(401).send({
        status: "FAILED",
        data: { error: [{ message: "Por favor, vuelve a iniciar sesion." }] },
      });
    }

    const sessionFound = await Session.findOne({ auth_token: auth_token });

    if (!sessionFound) {
      console.log("No hay una sesion activa para este token de acceso");
      return res.status(401).send({
        status: "FAILED",
        data: { error: [{ message: "Por favor, vuelve a iniciar sesion" }] },
      });
    }

    jwt.verify(auth_token, process.env.JWT_SECRET, (error, authData) => {
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
