import "dotenv/config";
import mongoose from "mongoose";
import country from "../models/country.model.js";
import State from "../models/state.model.js";

const seedStates = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(">>> DB is connected");

    const countryFound = await country.findOne({ name: "Bolivia" });

    if (!countryFound) {
      console.error("Country not found!");
      return;
    }

    const states = [
      { country_id: countryFound._id, name: "La Paz" },
      { country_id: countryFound._id, name: "Cochabamba" },
      { country_id: countryFound._id, name: "Santa Cruz" },
      { country_id: countryFound._id, name: "Oruro" },
      { country_id: countryFound._id, name: "Potosí" },
      { country_id: countryFound._id, name: "Chuquisaca" },
      { country_id: countryFound._id, name: "Tarija" },
      { country_id: countryFound._id, name: "Beni" },
      { country_id: countryFound._id, name: "Pando" },
    ];

    await State.insertMany(states);

    console.log("States seeded successfully!");
  } catch (error) {
    console.error("Error seeding states:", error);
  } finally {
    mongoose.connection.close();
    console.log(">>> DB is disconnected");
  }
};

seedStates();
