const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_URI_PRODUCTION, {
      dbName: "certificate-generator",
    });
    console.log("Database connection established successfully!!!");
  } catch (error) {
    console.log(
      `There was an error trying to connect to DB!!! ${error.message}`
    );
  }
};

module.exports = { connectToDB };
