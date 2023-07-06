//Here is the code to connect to mongodb server
const mongoose = require("mongoose");

const mongoURI = "mongodb://127.0.0.1:27017/?directConnection=true";

const connectToMongo = async () => {
  await mongoose.connect(mongoURI);
  console.log("sucessful connection");
};

module.exports = connectToMongo;
