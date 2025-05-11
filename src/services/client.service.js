import Client from "../database/models/client.model.js";
import Company from "../database/models/company.model.js";

import { parseCSV } from "../libs/csvParser.js";

class ClientService {
  async getMyClientById(id) {
    try {
      const client = await Client.findById(id).select(
        "-app_verify_otp -app_verify_otp_expired_at -app_access_enable"
      );
      if (!client) {
        throw new Error("Client not found");
      }
      return client;
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async getAllMyClients(userId) {
    try {
      const companyFound = await Company.findOne({ user_id: userId }).select(
        "-app_verify_otp -app_verify_otp_expired_at -app_access_enable"
      );
      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes una empresa registrada.",
        };
      }

      const clients = await Client.find({ company_id: companyFound._id });
      if (!clients) {
        throw {
          status: 404,
          userErrorMessage: "No tienes una empresa registrada.",
        };
      }
      return clients;
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async uploadClients(userId, file) {
    try {
      const companyFound = await Company.findOne({ user_id: userId });

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes una empresa registrada.",
        };
      }

      const clientsData = await parseCSV(file);

      for (const clientData of clientsData) {
        const existingClient = await Client.findOne({
          erp_client_id: clientData.id,
        });

        if (existingClient) {
          await Client.updateOne(
            { erp_client_id: clientData.id },
            {
              $set: {
                name: clientData.name,
                nit: clientData.nit,
                email: clientData.email,
                phone_number: clientData.phone_number,
              },
            }
          );
        } else {
          const newClient = new Client({
            erp_client_id: clientData.id,
            name: clientData.name,
            nit: clientData.nit,
            email: clientData.email,
            phone_number: clientData.phone_number,
            company_id: companyFound._id,
          });
          await newClient.save();
        }
      }

      return {
        message: "Clientes cargados correctamente.",
      };
    } catch (error) {
      console.error(error);

      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }
}

export default new ClientService();
