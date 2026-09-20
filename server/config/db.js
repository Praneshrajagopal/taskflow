import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    console.log("Connecting to MongoDB...");

    const connection = await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully!");
    console.log("Host:", connection.connection.host);
    console.log("Database:", connection.connection.name);

  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error("Error:", error.message);
  }
};

export default connectDB;