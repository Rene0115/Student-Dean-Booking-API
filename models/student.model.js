import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";


const studentSchema = mongoose.Schema(
  {
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
  },
  { versionKey: false, timestamps: true }
);

studentSchema.methods.generateToken = () => {
  const token = uuidv4();
  return token;
};

const studentModel = mongoose.model("Student", studentSchema);

export default studentModel;
