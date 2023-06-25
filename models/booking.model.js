import mongoose from "mongoose";

const SessionSchema = mongoose.Schema({
  booked: {
    type: Date
  },
  studentid: {
    type: String,
    ref: 'User',
    required: true
  }
},{versionKey: false, timestamps: true});

const sessionModel = mongoose.model('Session', SessionSchema);

export default sessionModel