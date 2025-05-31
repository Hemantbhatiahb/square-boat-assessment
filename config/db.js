const { mongoose } = require("mongoose");
require("dotenv").config();

const dbURL = process.env.DB_URL;
const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("Successfully connected to database");
  } catch (error) {
    console.log("Error connnecting to database: ", error.message);
  }
};

module.exports = connectDB;
