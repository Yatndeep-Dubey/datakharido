const mongoose = require("mongoose");
const env = require('../environment/env')
const databaseConnection = () => {
  mongoose
    .connect(env.DATABASE_URL)
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = { databaseConnection };