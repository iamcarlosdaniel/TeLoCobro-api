import locationService from "../services/location.service.js";

class LocationController {
  async getAllCountries(req, res) {
    try {
      const countries = await locationService.getAllCountries();
      res.status(200).send({
        status: "OK",
        data: countries,
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

  async getAllStates(req, res) {
    try {
      const { country_id } = req.params;
      const states = await locationService.getAllStates(country_id);
      res.status(200).send({
        status: "OK",
        data: states,
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
  async getAllCities(req, res) {
    try {
      const { state_id } = req.params;
      const cities = await locationService.getAllCities(state_id);
      res.status(200).send({
        status: "OK",
        data: cities,
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

export default new LocationController();
