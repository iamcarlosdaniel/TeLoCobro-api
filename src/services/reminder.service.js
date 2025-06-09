import Reminder from "../database/models/reminder.model.js";
import ReminderConfig from "../database/models/reminderConfig.model.js";
import Client from "../database/models/client.model.js";
import Company from "../database/models/company.model.js";
import { sendEmail } from "../libs/sendEmail.js";

class ReminderService {
  async enableReminderConfig(companyId) {
    try {
      const existingConfig = await ReminderConfig.findOneAndUpdate(
        { company_id: companyId },
        { status: "enabled" },
        { new: true }
      );

      if (!existingConfig) {
        throw {
          status: 404,
          userErrorMessage:
            "No se encontró la configuración de recordatorio para esta empresa. Por favor, registra una empresa primero.",
        };
      }

      return {
        message: "Configuración de recordatorio habilitada exitosamente.",
      };
    } catch (error) {
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async disableReminderConfig(companyId) {
    try {
      const existingConfig = await ReminderConfig.findOneAndUpdate(
        { company_id: companyId },
        { status: "disabled" },
        { new: true }
      );

      if (!existingConfig) {
        throw {
          status: 404,
          userErrorMessage:
            "No se encontró la configuración de recordatorio para esta empresa. Por favor, registra una empresa primero.",
        };
      }

      return {
        message: "Configuración de recordatorio deshabilitada exitosamente.",
      };
    } catch (error) {
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async getReminderConfig(companyId) {
    try {
      const reminderConfig = await ReminderConfig.findOne({
        company_id: companyId,
      });
      if (!reminderConfig) {
        throw {
          status: 404,
          userErrorMessage:
            "No se encontró la configuración de recordatorio para esta empresa.",
        };
      }
      return {
        message: "Configuración de recordatorio obtenida exitosamente.",
        data: { config: reminderConfig },
      };
    } catch (error) {
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async setFrecuencyReminderConfig(companyId, daysBeforeDue) {
    try {
      const existingConfig = await ReminderConfig.findOneAndUpdate(
        { company_id: companyId },
        { days_before_due: daysBeforeDue }
      );
      if (!existingConfig) {
        throw {
          status: 404,
          userErrorMessage:
            "No se encontró la configuración de recordatorio para esta empresa.",
        };
      }
      return {
        message: "Frecuencia de recordatorio actualizada exitosamente.",
      };
    } catch (error) {
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  //obtener todas las notificaciones enviadas
  async getAllCompanyReminders(userId) {
    try {
      const companyFound = await Company.findOne({
        user_id: userId,
      });

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage:
            "No tienes una empresa registrada. Por favor, registra una empresa primero.",
        };
      }
      const reminders = await Reminder.find({ sent_by: companyFound._id })
        .populate("sent_to", "first_name last_name email phone_number")
        .exec();

      if (reminders.length === 0) {
        return {
          message: "No hay recordatorios enviados por esta empresa.",
          reminders: [],
        };
      }

      return {
        message: "Recordatorios obtenidos exitosamente.",
        reminders: reminders,
      };
    } catch (error) {
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  //obtener recordatorio por id
  //para compania
  async getMyClientsReminderById(userId, reminderId) {
    try {
      const companyFound = await Company.findOne({
        user_id: userId,
      });

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage:
            "No tienes una empresa registrada. Por favor, registra una empresa primero.",
        };
      }

      const reminder = await Reminder.findOne({
        _id: reminderId,
        sent_by: companyFound._id,
      })
        .populate("sent_to", "first_name last_name email phone_number")
        .exec();
      if (!reminder) {
        throw {
          status: 404,
          userErrorMessage: "Recordatorio no encontrado.",
        };
      }
      return {
        message: "Recordatorio obtenido exitosamente.",
        reminder: reminder,
      };
    } catch (error) {
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async getAllRemindersByClientId(userId, clientId) {
    try {
      const companyFound = await Company.findOne({
        user_id: userId,
      });

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage:
            "No tienes una empresa registrada. Por favor, registra una empresa primero.",
        };
      }

      const reminders = await Reminder.find({
        sent_by: companyFound._id,
        sent_to: clientId,
      })
        .populate("sent_to", "first_name last_name email phone_number")
        .exec();

      if (reminders.length === 0) {
        return {
          message: "No hay recordatorios enviados a este cliente.",
          reminders: [],
        };
      }

      return {
        message: "Recordatorios obtenidos exitosamente.",
        reminders: reminders,
      };
    } catch (error) {
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async getAllRemindersByCompanyId(companyId, clientId) {
    try {
      const reminders = await Reminder.find({
        sent_by: companyId,
        sent_to: clientId,
      })
        .populate("sent_to", "first_name last_name email phone_number")
        .exec();

      if (reminders.length === 0) {
        return {
          message: "No hay recordatorios enviados a este cliente.",
          reminders: [],
        };
      }

      return {
        message: "Recordatorios obtenidos exitosamente.",
        reminders: reminders,
      };
    } catch (error) {
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async getClientReminderById(reminderId, clientId) {
    try {
      const reminder = await Reminder.findOne({
        _id: reminderId,
        sent_to: clientId,
      })
        .populate("sent_to", "first_name last_name email phone_number")
        .exec();
      if (!reminder) {
        throw {
          status: 404,
          userErrorMessage: "Recordatorio no encontrado.",
        };
      }
      return {
        message: "Recordatorio obtenido exitosamente.",
        reminder: reminder,
      };
    } catch (error) {
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async sendReminder(userId, reminderData) {
    try {
      const companyFound = await Company.findOne({
        user_id: userId,
      });

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage:
            "No tienes una empresa registrada. Por favor, registra una empresa primero.",
        };
      }

      const clientFound = await Client.findOne({
        _id: reminderData.sent_to,
        company_id: companyFound._id,
      });

      if (!clientFound) {
        throw {
          status: 404,
          userErrorMessage:
            "Cliente no encontrado. Asegúrate de que el cliente pertenece a tu empresa.",
        };
      }

      const newReminder = new Reminder({
        ...reminderData,
        sent_by: companyFound._id,
        sent_to: clientFound._id,
      });

      await newReminder.save();

      const context = {
        title: reminderData.subject,
        message: reminderData.content,
      };

      await sendEmail(
        clientFound.email,
        reminderData.subject,
        "reminderTemplate",
        context
      );

      return {
        message: "Recordatorio creado exitosamente.",
      };
    } catch (error) {
      console.error("Error creating reminder:", error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }
}

export default new ReminderService();
