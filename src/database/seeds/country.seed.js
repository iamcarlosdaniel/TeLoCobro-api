import "dotenv/config";
import mongoose from "mongoose";
import Country from "../models/country.model.js";

const countries = [{ name: "Bolivia", iso_code: "BO", phone_code: "+591" }];

const seedCountries = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(">>> DB is connected");

    await Country.insertMany(countries);
    console.log("Countries seeded successfully!");
  } catch (error) {
    console.error("Error seeding countries:", error);
  } finally {
    mongoose.connection.close();
    console.log(">>> DB is disconnected");
  }
};

seedCountries();
