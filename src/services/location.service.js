import Country from "../database/models/country.model.js";
import State from "../database/models/state.model.js";
import City from "../database/models/city.model.js";

class LocationService {
  async getAllCountries() {
    try {
      const countries = await Country.find({});
      return countries;
    } catch (error) {
      throw error;
    }
  }

  async getAllStates(country_id) {
    try {
      const states = await State.find({ country_id });
      return states;
    } catch (error) {
      throw error;
    }
  }

  async getAllCities(state_id) {
    try {
      const cities = await City.find({ state_id });
      return cities;
    } catch (error) {
      throw error;
    }
  }
}

export default new LocationService();
