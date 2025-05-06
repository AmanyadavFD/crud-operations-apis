const mongoose = require("mongoose");
require("dotenv").config();

const mongoosUrl = process.env.MONGODB;

const initalizeDataBase = async () => {
  await mongoose
    .connect(mongoosUrl)
    .then(() => console.log("Connected to DB"))
    .catch((error) => {
      console.log(error);
    });
};

module.exports = initalizeDataBase;
