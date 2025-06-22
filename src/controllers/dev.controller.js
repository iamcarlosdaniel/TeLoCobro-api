import Dev from "../database/models/dev.model.js";

class DevController {
  async getDevConfig(req, res) {
    try {
      const { mail_service, mail_service_user, mail_service_password } =
        req.body;
      const devConfig = await Dev.findOne({
        mail_service: mail_service,
        mail_service_user: mail_service_user,
        mail_service_password: mail_service_password,
      })
        .lean()
        .select("-mail_service_password");
      if (!devConfig) {
        return res.status(404).send({
          message: "Dev configuration not found",
        });
      }

      return res.status(200).send({
        message:
          "Usted se encuentra usando las credenciales de desarrollo de " +
          devConfig.mail_service_user +
          ". Por favor, no use estas credenciales sin autorizacion previa.",
        data: devConfig,
      });
    } catch (error) {
      console.error("Error fetching dev config:", error);
      return res.status(500).send({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async updateDevConfig(req, res) {
    try {
      const { mail_service, mail_service_user, mail_service_password } =
        req.body;

      const devId = req.params.devId;

      if (!mail_service || !mail_service_user || !mail_service_password) {
        return res.status(400).send({
          message: "All fields are required",
        });
      }

      const updatedConfig = await Dev.findOneAndUpdate(
        {
          _id: devId,
        },
        {
          mail_service: mail_service,
          mail_service_user: mail_service_user,
          mail_service_password: mail_service_password,
        },
        { new: true, upsert: true }
      ).lean();

      return res.status(200).send({
        message:
          "Credenciales de desarrollo actualizadas correctamente. Si tiene algun problema, por favor, contacte al administrador (Sabine Lohner).",
        data: updatedConfig,
      });
    } catch (error) {
      console.error("Error updating dev config:", error);
      return res.status(500).send({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  async deleteDevConfig(req, res) {
    try {
      const devId = req.params.devId;

      const updatedConfig = await Dev.findOneAndUpdate(
        {
          _id: devId,
        },
        {
          mail_service: "none",
          mail_service_user: "none",
          mail_service_password: "none",
        },
        { new: true, upsert: true }
      ).lean();

      return res.status(200).send({
        message:
          "Credenciales de desarrollo eliminadas correctamente. Si tiene algun problema, por favor, contacte al administrador (Sabine Lohner).",
        data: updatedConfig,
      });
    } catch (error) {
      console.error("Error deleting dev config:", error);
      return res.status(500).send({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
}

export default new DevController();
