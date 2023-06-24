import mongoose from "mongoose";

const tokenSchema = mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  studentid: {
    type: String,
    ref: 'Student',
    required: true
  }
});

const tokenModel = mongoose.model("Token", tokenSchema);

export default tokenModel
