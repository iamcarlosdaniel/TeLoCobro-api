import Company from "../database/models/company.model.js";
import City from "../database/models/city.model.js";
import Channel from "../database/models/channel.model.js";

class CompanyService {
  async getMyCompany(userId) {
    try {
      const companyFound = await Company.findOne({ user_id: userId });

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes una empresa registrada.",
        };
      }

      return {
        message: "Información obtenida exitosamente.",
        data: companyFound,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async createCompany(userId, companyData) {
    try {
      const companyFound = await Company.findOne({ user_id: userId });

      if (companyFound) {
        throw {
          status: 400,
          userErrorMessage: "Ya tienes una empresa registrada.",
        };
      }

      const cityFound = await City.findById(companyData.city_id);

      if (!cityFound) {
        throw {
          status: 404,
          userErrorMessage:
            "No se encontro la ciudad proporcionada. Por favor, verifique la ciudad.",
        };
      }

      const newCompany = await Company.create({
        ...companyData,
        status: "active",
        user_id: userId,
      });

      await Channel.create({
        company_id: newCompany._id,
        status: "inactive",
      });

      return {
        message: "Empresa creada exitosamente.",
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async updateCompany(userId, companyData) {
    try {
      const cityFound = await City.findById(companyData.city_id);

      if (!cityFound) {
        throw {
          status: 404,
          userErrorMessage:
            "No se encontro la ciudad proporcionada. Por favor, verifique la ciudad.",
        };
      }
      const companyFound = await Company.findOneAndUpdate(
        { user_id: userId },
        { ...companyData },
        { new: true }
      );

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes una empresa registrada.",
        };
      }

      return {
        message: "Empresa actualizada exitosamente.",
        data: companyFound,
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async activateCompany(userId) {
    try {
      const companyFound = await Company.findOneAndUpdate(
        { user_id: userId },
        { status: "active" },
        { new: true }
      );

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes una empresa registrada.",
        };
      }

      return {
        message: "Empresa activada exitosamente.",
      };
    } catch (error) {
      console.log(error);
      throw {
        status: error.status,
        message: error.userErrorMessage,
      };
    }
  }

  async deactivateCompany(userId) {
    try {
      const companyFound = await Company.findOneAndUpdate(
        { user_id: userId },
        { status: "inactive" },
        { new: true }
      );

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes una empresa registrada.",
        };
      }

      return {
        message: "Empresa desactivada exitosamente.",
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

export default new CompanyService();
