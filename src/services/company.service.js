import Company from "../database/models/company.model.js";
import City from "../database/models/city.model.js";

class CompanyService {
  async getMyCompany(userId) {
    try {
      const companyFound = await Company.findOne({ user_id: userId })
        .select("-_v")
        .populate({
          path: "city_id",
          select: "-__v -createdAt -updatedAt -is_allowed",
          populate: {
            path: "state_id",
            select: "-__v -createdAt -updatedAt -is_allowed",
            populate: {
              path: "country_id",
              select: "-__v -createdAt -updatedAt -is_allowed",
            },
          },
        })
        .lean();

      if (!companyFound) {
        throw {
          status: 404,
          userErrorMessage: "No tienes una empresa registrada.",
        };
      }

      const company = {
        _id: companyFound._id,
        user_id: companyFound.user_id,
        name: companyFound.name,
        nit: companyFound.nit,
        legal_name: companyFound.legal_name,
        description: companyFound.description,
        location: {
          country: companyFound.city_id?.state_id?.country_id?.name,
          state: companyFound.city_id?.state_id?.name,
          city: companyFound.city_id?.name,
        },
        createAt: companyFound.createdAt,
        updateAt: companyFound.updatedAt,
      };

      return {
        message: "Información obtenida exitosamente.",
        data: company,
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

      await Company.create({
        ...companyData,
        user_id: userId,
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
