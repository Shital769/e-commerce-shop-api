import mongoose from "mongoose";

const sessionTokenSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "active",
    },
    token: {
      type: String,
      required: true,
    },
    associate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Session", sessionTokenSchema);
