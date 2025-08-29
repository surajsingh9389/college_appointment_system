import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Connect to MongoDB using MONGODB_URI from environment variables
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}`);

    // If successful
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // Log the error if connection fails
    console.log(`MongoDB connection error: ${error}`);
  }
};

export default connectDB;
