import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },
    fName: {
      type: Stting,
      required: true,
    },
    lName: {
      type: Stting,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: 1,
    },
    passwprd: {
      type: String,
      default: "inactive",
    },
    phone: {
      type: String,
      required: true,
    },
    emailVerificationCode: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Client_Shop_User", userSchema);
