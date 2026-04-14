import mongoose from "mongoose";

export const isMongoConfigured = () => {
  const value = process.env.MONGODB_URI?.trim();
  return Boolean(
    value &&
      (value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"))
  );
};

const connectDB = async () => {
  try {
    if (!isMongoConfigured()) {
      console.log("MongoDB URI not configured. Using local file storage.");
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
