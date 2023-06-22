import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
  studentid: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^\d{6}$/.test(value);
      },
      message: "Student ID must be 6 digits"
    }
  },
  password: {
    type: String,
    required: true
  }
});

const studentModel = mongoose.model("Student", studentSchema);

export default studentModel;
