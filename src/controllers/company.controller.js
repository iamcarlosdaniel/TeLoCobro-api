import companyService from "../services/company.service.js";

class CompanyController {
  async getMyCompany(req, res) {
    try {
      const response = await companyService.getMyCompany(req.authUserData.id);

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

  async createCompany(req, res) {
    try {
      const response = await companyService.createCompany(
        req.authUserData.id,
        req.body
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

  async updateCompany(req, res) {
    try {
      const response = await companyService.updateCompany(
        req.authUserData.id,
        req.body
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
}

export default new CompanyController();
