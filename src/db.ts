import mongoose from "mongoose";
require("dotenv").config()

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL!!);
    console.log("Connected to database sucessfully")
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
