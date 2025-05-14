export const authorizationMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.authData || !allowedRoles.includes(req.authData.user_type)) {
      return res.status(403).send({
        status: "FAILED",
        data: {
          error: [
            {
              message:
                "Acceso denegado. No tienes permiso para acceder a este recurso.",
            },
          ],
        },
      });
    }
    next();
  };
};
