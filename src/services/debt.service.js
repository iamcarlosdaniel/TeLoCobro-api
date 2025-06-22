import Company from "../database/models/company.model.js";
import Debt from "../database/models/debt.model.js";
import Client from "../database/models/client.model.js";

import { parseCSV } from "../libs/csvParser.js";
import {
  calculateTotalDebtBOB,
  calculatePendingDebtBOB,
  calculateAveragePaymentTime,
  calculatePaymentDelayRate,
  calculateTheRiskOfDefault,
} from "../libs/debtCalculations.js";

class DebtService {
  /*
  Summary 
  Esta funcion obtiene todas las deudas de los clientes de una empresa (usuario)
  */
  async getAllDebts(userId) {
    try {
      const companyFound = await Company.findOne({ user_id: userId });

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes una empresa registrada.",
        };
      }

      const debts = await Debt.find({
        company_id: companyFound._id,
      }).populate(
        "client_id",
        "-app_verify_otp -app_verify_otp_expired_at -app_access_enable"
      );

      if (!debts) {
        throw {
          status: 404,
          userErrorMessage: "No tienes deudas registradas.",
        };
      }

      return {
        message: "Deudas encontradas",
        debts: debts,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  /*
  Summary 
  Esta funcion obtiene todas las deudas de un cliente especifico mediante su id, mientras el cliente este afiliado a la empresa (usuario) actualemte logueada
  */
  async getClientDebtsById(userId, clientId) {
    try {
      const companyFound = await Company.findOne({ user_id: userId });

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes una empresa registrada.",
        };
      }

      const debts = await Debt.find({
        company_id: companyFound._id,
        client_id: clientId,
      }).populate(
        "client_id",
        "-app_verify_otp -app_verify_otp_expired_at -app_access_enable"
      );

      if (!debts) {
        throw {
          status: 404,
          userErrorMessage: "No tienes deudas registradas.",
        };
      }

      return {
        message: "Deudas encontradas",
        debts: debts,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  /*
  Summary
  Permite obtener todas las deudas de un cliente especifico mediante su id, mientras el cliente este afiliado a la empresa (usuario) actualemte logueada y filtrando por el estado de la deuda
  */
  async getClientDebtsByStatus(userId, clientId, status) {
    try {
      const companyFound = await Company.findOne({ user_id: userId });

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes una empresa registrada.",
        };
      }

      const debts = await Debt.find({
        company_id: companyFound._id,
        client_id: clientId,
        status,
      }).populate(
        "client_id",
        "-app_verify_otp -app_verify_otp_expired_at -app_access_enable"
      );

      if (!debts) {
        throw {
          status: 404,
          userErrorMessage: "No tienes deudas registradas.",
        };
      }

      return {
        message: "Deudas encontradas",
        debts: debts,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  /*
  Summary
  Esta funcion permite subir un archivo con las deudas de los clientes de una empresa (usuario) y lo procesa para crear las deudas en la base de datos
  */
  async uploadDebts(userId, file) {
    try {
      const companyFound = await Company.findOne({ user_id: userId });

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes una empresa registrada.",
        };
      }

      const companyId = companyFound._id;
      const records = await parseCSV(file);

      for (const record of records) {
        const {
          id: erp_debt_id,
          client_id: erp_client_id,
          issue_date,
          invoice_number,
          due_date,
          currency,
          outstanding,
        } = record;

        const client = await Client.findOne({
          company_id: companyId,
          erp_client_id: erp_client_id,
        });

        if (!client) {
          console.warn(
            `Cliente con erp_client_id ${erp_client_id} no encontrado.`
          );
          continue;
        }

        const existingDebt = await Debt.findOne({ erp_debt_id });
        if (existingDebt) {
          console.warn(`Deuda con erp_debt_id ${erp_debt_id} ya existe.`);
          continue;
        }

        const debt = new Debt({
          company_id: companyId,
          erp_debt_id,
          client_id: client._id,
          issue_date: new Date(issue_date),
          invoice_number,
          due_date: new Date(due_date),
          currency,
          outstanding: parseFloat(outstanding),
        });

        await debt.save();
      }

      return {
        message: "Deudas cargadas exitosamente",
      };
    } catch (error) {
      console.error(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  /*
  Summary
  Esta funcion permite actualizar el estado de una deuda especifica mediante su id, mientras la deuda este afiliada a la empresa (usuario) actualemte logueada
  */
  async updateDebtStatus(userId, debtId, status) {
    try {
      const companyFound = await Company.findOne({ user_id: userId });

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes una empresa registrada.",
        };
      }

      const debt = await Debt.findOne({
        company_id: companyFound._id,
        _id: debtId,
      });
      if (!debt) {
        throw {
          status: 404,
          userErrorMessage: "No tienes deudas registradas.",
        };
      }

      if (debt.status === "paid") {
        throw {
          status: 400,
          userErrorMessage: "La deuda ya se encuentra pagada.",
        };
      } else {
        debt.status = status;
      }

      if (status === "paid") {
        debt.paid_at = new Date();
      } else {
        debt.paid_at = null;
      }

      await debt.save();
      return {
        message: "Estado de la deuda actualizado correctamente",
        debt: debt,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  /*
  Summary
  Esta funcion permite obtener todas las deudas de un cliente especifico, mientras el cliente se encuentre logueado en la aplicacion movil
  */
  async getAllMyDebts(clientId) {
    try {
      const clientFound = await Client.findById(clientId);
      if (!clientFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes un cliente registrado.",
        };
      }
      const debts = await Debt.find({
        client_id: clientId,
      }).populate(
        "client_id",
        "-app_verify_otp -app_verify_otp_expired_at -app_access_enable"
      );

      if (!debts) {
        throw {
          status: 404,
          userErrorMessage: "No tienes deudas registradas.",
        };
      }
      return {
        message: "Deudas encontradas",
        debts: debts,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  /*
  Summary
  Esta funcion permite obtener una deuda especifica mediante su id del cliente actualmente logueado, mientras el cliente se encuentre logueado en la aplicacion movil
  */
  async getMyDebtById(clientId, debtId) {
    try {
      const clientFound = await Client.findById(clientId);
      if (!clientFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes un cliente registrado.",
        };
      }
      const debt = await Debt.findOne({
        client_id: clientId,
        _id: debtId,
      }).populate(
        "client_id",
        "-app_verify_otp -app_verify_otp_expired_at -app_access_enable"
      );
      if (!debt) {
        throw {
          status: 404,
          userErrorMessage: "No tienes deudas registradas.",
        };
      }
      return {
        message: "Deuda encontrada",
        debt: debt,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async getMyDebtsByStatus(clientId, status) {
    try {
      const clientFound = await Client.findById(clientId);
      if (!clientFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes un cliente registrado.",
        };
      }
      const debts = await Debt.find({
        client_id: clientId,
        status,
      }).populate(
        "client_id",
        "-app_verify_otp -app_verify_otp_expired_at -app_access_enable"
      );
      if (!debts) {
        throw {
          status: 404,
          userErrorMessage: "No tienes deudas registradas.",
        };
      }
      return {
        message: "Deudas encontradas",
        debts: debts,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  //!SE RECOMIENDA SEPARAR DE ESTA FUNCION EN SERVICIOS INDEPENDIENTES Y ALGUNOS DE LOS CALCULOS AUTOMATIZARLOS
  //!REFACTORIZAR SERVICIO
  //atte: Daniel
  async calculateMorosity(userId, clientId) {
    try {
      const companyFound = await Company.findOne({ user_id: userId });

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes una empresa registrada.",
        };
      }

      const debtsFound = await Debt.find({
        company_id: companyFound._id,
        client_id: clientId,
      });

      if (!debtsFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes deudas registradas.",
        };
      }

      if (debtsFound.length === 0) {
        throw {
          status: 404,
          userErrorMessage: "No se encontraron deudas para el cliente.",
        };
      }

      const totalDebtBOB = await calculateTotalDebtBOB(debtsFound);
      const totalPendingDebtBOB = await calculatePendingDebtBOB(debtsFound);
      const averagePaymentTime = await calculateAveragePaymentTime(debtsFound);
      const paymentDelayRate = await calculatePaymentDelayRate(debtsFound);
      const debtCount = debtsFound.length;

      const dataToSendToTheApi = {
        totalDebtBOB: totalDebtBOB,
        totalPendingDebtBOB: totalPendingDebtBOB,
        averagePaymentTime: averagePaymentTime,
        paymentDelayRate: paymentDelayRate,
        debtCount: debtCount,
      };

      console.log("Datos que se enviarán a la API:", dataToSendToTheApi);

      const response = await calculateTheRiskOfDefault(dataToSendToTheApi);

      await Client.findOneAndUpdate(
        { _id: clientId, company_id: companyFound._id },
        {
          total_debt_bs: totalDebtBOB,
          total_pending_debt_bs: totalPendingDebtBOB,
          average_payment_time: averagePaymentTime,
          payment_delay_rate: paymentDelayRate,
          debt_count: debtCount,
          morosity: {
            prediction: response.prediction,
            probability: response.probability,
            threshold: response.threshold,
          },
        },
        { new: true }
      );

      return {
        message: "Morosidad calculada exitosamente",
        morosity: {
          total_debt_bs: totalDebtBOB,
          total_pending_debt_bs: totalPendingDebtBOB,
          average_payment_time: averagePaymentTime,
          payment_delay_rate: paymentDelayRate,
          debt_count: debtCount,
          prediction: response.prediction,
          probability: response.probability,
          threshold: response.threshold,
        },
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }
}

export default new DebtService();
