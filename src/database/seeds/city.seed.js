import "dotenv/config";
import mongoose from "mongoose";
import Country from "../models/country.model.js";
import State from "../models/state.model.js";
import City from "../models/city.model.js";

const departmentCities = {
  "La Paz": ["La Paz", "El Alto", "Viacha", "Coroico", "Desaguadero"],
  Cochabamba: ["Cochabamba", "Sacaba", "Quillacollo", "Vinto", "Tiquipaya"],
  "Santa Cruz": [
    "Santa Cruz de la Sierra",
    "Warnes",
    "Cotoca",
    "Montero",
    "Puerto Suárez",
  ],
  Oruro: ["Oruro", "Huanuni", "Poopó", "Challapata"],
  Potosí: ["Potosí", "Sucre", "Villazón", "Tupiza", "Uncía"],
  Chuquisaca: ["Sucre", "Yamparáez", "Zudáñez", "Padilla"],
  Tarija: ["Tarija", "Villa Montes", "Yacuiba", "San Andrés"],
  Beni: ["Trinidad", "Riberalta", "Guayaramerín", "Yacuma"],
  Pando: ["Cobija", "Porvenir", "Filadelfia"],
};

const seedCities = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(">>> DB is connected");

    const countryFound = await Country.findOne({ name: "Bolivia" });
    if (!countryFound) {
      console.error("Country not found!");
      return;
    }

    const states = await State.find({ country_id: countryFound._id });

    for (const state of states) {
      const departmentName = state.name;

      if (departmentCities[departmentName]) {
        for (const cityName of departmentCities[departmentName]) {
          const city = new City({
            name: cityName,
            state_id: state._id,
          });

          await city.save();
          console.log(`City '${cityName}' added to state '${departmentName}'`);
        }
      }
    }

    console.log("Cities seeded successfully!");
  } catch (error) {
    console.error("Error seeding cities:", error);
  } finally {
    mongoose.connection.close();
    console.log(">>> DB is disconnected");
  }
};

seedCities();
