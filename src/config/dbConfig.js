import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_CLIENT) {
      return console.log(
        "Make sure environment varibale MONGO_CLIENT has mongoDB connection link"
      );
    }

    mongoose.set("strictQuery", true);
    const conn = await mongoose.connect(process.env.MONGO_CLIENT);

    conn?.connections && console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};
