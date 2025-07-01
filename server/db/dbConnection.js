import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://waaseyzulfiqar04:waasey04@smarthome.9yilpls.mongodb.net/smartHome`
    );
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.log(`MongoDB Connection Error`, error.message);
  }
};
