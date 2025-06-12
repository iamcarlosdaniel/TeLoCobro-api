import debtService from "../services/debt.service.js";

class DebtController {
  /*
  Summary 
  Esta funcion obtiene todas las deudas de los clientes de una empresa (usuario)
  */
  async getAllDebts(req, res) {
    try {
      const userId = req.authData.id;
      const response = await debtService.getAllDebts(userId);

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

  /*
  Summary 
  Esta funcion obtiene todas las deudas de un cliente especifico mediante su id, mientras el cliente este afiliado a la empresa (usuario) actualemte logueada
  */
  async getClientDebtsById(req, res) {
    try {
      const userId = req.authData.id;
      const clientId = req.params.id;

      const response = await debtService.getClientDebtsById(userId, clientId);

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

  /*
  Summary
  Permite obtener todas las deudas de un cliente especifico mediante su id, mientras el cliente este afiliado a la empresa (usuario) actualemte logueada y filtrando por el estado de la deuda
  */
  async getClientDebtsByStatus(req, res) {
    try {
      const userId = req.authData.id;
      const clientId = req.params.id;
      const status = req.query.status;

      console.log("clientId", clientId);
      console.log("status", status);

      const response = await debtService.getClientDebtsByStatus(
        userId,
        clientId,
        status
      );

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

  /*
  Summary
  Esta funcion permite subir un archivo con las deudas de los clientes de una empresa (usuario) y lo procesa para crear las deudas en la base de datos
  */
  async uploadDebts(req, res) {
    try {
      const userId = req.authData.id;
      const file = req.file;

      const response = await debtService.uploadDebts(userId, file);

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

  /*
  Summary
  Esta funcion permite actualizar el estado de una deuda especifica mediante su id, mientras la deuda este afiliada a la empresa (usuario) actualemte logueada
  */
  async updateDebtStatus(req, res) {
    try {
      const userId = req.authData.id;
      const debtId = req.params.id;
      const status = req.query.status;

      const response = await debtService.updateDebtStatus(
        userId,
        debtId,
        status
      );

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

  /*
  Summary
  Esta funcion permite obtener todas las deudas de un cliente especifico, mientras el cliente se encuentre logueado en la aplicacion movil
  */
  async getAllMyDebts(req, res) {
    try {
      const clientId = req.authData.id;
      const response = await debtService.getAllMyDebts(clientId);

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

  /*
  Summary
  Esta funcion permite obtener una deuda especifica mediante su id del cliente actualmente logueado, mientras el cliente se encuentre logueado en la aplicacion movil
  */
  async getMyDebtById(req, res) {
    try {
      const clientId = req.authData.id;
      const debtId = req.params.id;
      const response = await debtService.getMyDebtById(clientId, debtId);

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

  async getMyDebtsByStatus(req, res) {
    try {
      const clientId = req.authData.id;
      const status = req.query.status;
      const response = await debtService.getMyDebtsByStatus(clientId, status);

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

  async calculateMorosity(req, res) {
    try {
      const clientId = req.params.id;
      const companyId = req.authData.id;
      const response = await debtService.calculateMorosity(clientId, companyId);

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
}

export default new DebtController();
