import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
  studentid: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});
