const dns = require("node:dns");



const mongoose = require("mongoose");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};
module.exports = connectDB;
