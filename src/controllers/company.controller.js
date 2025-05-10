import companyService from "../services/company.service.js";

class CompanyController {
  async getMyCompany(req, res) {
    try {
      const response = await companyService.getMyCompany(req.authUserData.id);

      return res.status(200).json(response);
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

  async createCompany(req, res) {
    try {
      const response = await companyService.createCompany(
        req.authUserData.id,
        req.body
      );

      return res.status(201).json(response);
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

  async updateCompany(req, res) {
    try {
      const response = await companyService.updateCompany(
        req.authUserData.id,
        req.body
      );

      return res.status(200).json(response);
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

  async activateCompany(req, res) {
    try {
      const response = await companyService.activateCompany(req.authData.id);

      return res.status(200).json(response);
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

  async deactivateCompany(req, res) {
    try {
      const response = await companyService.deactivateCompany(req.authData.id);

      return res.status(200).json(response);
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

export default new CompanyController();
