const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
  } catch (error) {
    console.log(`Database connection error : ${error}`);
  }
};
module.exports = connectDb;
