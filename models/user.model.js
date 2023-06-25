import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = mongoose.Schema(
  {
    id: {
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
    },
    role: {
      type: String,
      default: "student",
      required: true,
      enum: ["student", "dean"]
    }
  },
  { versionKey: false, timestamps: true }
);

userSchema.methods.generateToken = () => {
  const token = uuidv4();
  return token;
};

const userModel = mongoose.model("User", userSchema);

export default userModel;