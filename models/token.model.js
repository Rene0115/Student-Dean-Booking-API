import mongoose from "mongoose";

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true
    },
    studentid: {
      type: String,
      ref: "Student",
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true,
    expires: 2 * 60 * 60
  }
);

const tokenModel = mongoose.model("Token", tokenSchema);

export default tokenModel;
