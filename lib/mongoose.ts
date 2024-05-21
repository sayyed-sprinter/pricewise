import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI)
    return console.log("MongoDB URI is not defined");

  if (isConnected)
    return console.log(":using existing db conn");

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("db error" + error);
  }
};
