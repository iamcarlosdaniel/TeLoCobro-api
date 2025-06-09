import reminderService from "../services/reminder.service.js";

class ReminderController {
  async enableReminderConfig(req, res) {
    try {
      const companyId = req.authData.id;
      const response = await reminderService.enableReminderConfig(companyId);
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

  async disableReminderConfig(req, res) {
    try {
      const companyId = req.authData.id;
      const response = await reminderService.disableReminderConfig(companyId);
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

  async getReminderConfig(req, res) {
    try {
      const companyId = req.authData.id;
      const response = await reminderService.getReminderConfig(companyId);
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

  async setFrecuencyReminderConfig(req, res) {
    try {
      const companyId = req.authData.id;
      const { days_before_due } = req.body;
      const response = await reminderService.setFrecuencyReminderConfig(
        companyId,
        days_before_due
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

  async getAllCompanyReminders(req, res) {
    try {
      const userId = req.authData.id;
      const response = await reminderService.getAllCompanyReminders(userId);
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

  //para compania
  async getMyClientsReminderById(req, res) {
    try {
      const reminderId = req.params.id;
      const userId = req.authData.id;
      const response = await reminderService.getMyClientsReminderById(
        userId,
        reminderId
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

  async getAllRemindersByClientId(req, res) {
    try {
      const clientId = req.params.id;
      const userId = req.authData.id;
      const response = await reminderService.getAllRemindersByClientId(
        userId,
        clientId
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

  async getAllRemindersByCompanyId(req, res) {
    try {
      const companyId = req.params.id;
      const clientId = req.authData.id;
      const response = await reminderService.getAllRemindersByCompanyId(
        companyId,
        clientId
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

  async getClientReminderById(req, res) {
    try {
      const id = req.params.id;
      const clientId = req.authData.id;
      const response = await reminderService.getClientReminderById(
        id,
        clientId
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

  async sendReminder(req, res) {
    try {
      const userId = req.authData.id;
      const reminderData = req.body;
      const response = await reminderService.sendReminder(userId, reminderData);
      res.status(201).send({
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

export default new ReminderController();
