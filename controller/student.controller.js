import bcrypt from "bcrypt";
import studentModel from "../models/student.model.js";
import { logger } from "../app.js";
import _ from "lodash";
import moment from "moment";
import sessionModel from "../models/booking.model.js";
import tokenModel from "../models/token.model.js";
import "moment-timezone";

moment.tz.setDefault("Africa/Lagos");

class StudentController {
  async create(req, res) {
    const data = {
      studentid: req.body.studentid,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    if (data.studentid.length < 6 || data.studentid.length > 6) {
      return res.status(400).send({
        success: false,
        message: "Studentid must be 6 digits"
      });
    }
    if (_.isEmpty(data.password || data.studentid)) {
      return res.status(400).send({
        success: false,
        error: "Must provide studentid and password"
      });
    }
    const exists = await studentModel.findOne({ studentid: data.studentid });
    if (exists) {
      return res.status(200).send({
        success: false,
        error: "Student already exists"
      });
    }
    try {
      const student = await studentModel.create(data);
      return res.status(200).send({
        success: true,
        studentid: student._id
      });
    } catch (error) {
      logger.error(error);
      return res.status(400).send({
        success: false,
        error: error.message
      });
    }
  }
  async login(req, res) {
    const data = {
      studentid: req.body.studentid,
      password: req.body.password
    };
    if (_.isEmpty(data.password || data.studentid)) {
      return res.status(400).send({
        success: false,
        error: "Must provide studentid and password"
      });
    }

    const student = await studentModel.findOne({ studentid: data.studentid });
    if (!student) {
      return res.status(200).send({
        success: false,
        error: "Student does not exists"
      });
    }
    const verifyPassword = bcrypt.compareSync(data.password, student.password);
    if (!verifyPassword) {
      return res.status(400).send({
        success: false,
        message: "email or password is invalid"
      });
    }
    try {
      const token = await student.generateToken();
      const tokenData = { token: token, studentid: data.studentid };
      const newTokenModel = await tokenModel.create(tokenData);
      console.log(newTokenModel);

      return res.status(200).send({
        message: "Login successful",
        studentid: student._id,
        token: token
      });
    } catch (err) {
      logger.error(err);
      return res.status(400).send({
        message: "Token generation error",
        error: err.message
      });
    }
  }

  async bookSession(req, res) {
    try {
      const data = {
        booked: req.body.date,
        studentid: req.student.studentid
      };

      if (!data.booked || !data.studentid) {
        return res.status(400).send({
          success: false,
          error: "Must provide studentid and date"
        });
      }

      const requestedDate = moment(data.booked);

      const now = moment();

      if (requestedDate.isBefore(now)) {
        return res.status(400).send({
          success: false,
          message: "The session time is in the past."
        });
      }
      console.log(requestedDate.hours());
      console.log(requestedDate.day());
      if ((requestedDate.day() !== 4 || 5) & (requestedDate.hours() !== 10)) {
        return res.status(400).send({
          success: false,
          message:
            "Sessions can only be created on Thursdays and Fridays at 10 AM."
        });
      }

      const existingSession = await sessionModel.findOne({
        booked: requestedDate.toDate()
      });
      if (existingSession) {
        return res.status(400).send({
          success: false,
          message: "The session slot is already booked."
        });
      }
      const session = await sessionModel.create({
        studentid: data.studentid,
        booked: requestedDate.toDate()
      });

      return res.status(200).send({
        success: true,
        message: "Session created successfully.",
        data: session
      });
    } catch (error) {
      logger.error(error);
      return res.status(400).send({
        success: false,
        error: error.message
      });
    }
  }
}

export default new StudentController();
