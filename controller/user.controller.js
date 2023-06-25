import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import { logger } from "../app.js";
import _ from "lodash";
import moment from "moment";
import sessionModel from "../models/booking.model.js";
import tokenModel from "../models/token.model.js";
class UserController {
  async create(req, res) {
    const data = {
      id: req.body.id,
      password: bcrypt.hashSync(req.body.password, 10),
      role: req?.body.role
    };
    if (data.id.length < 6 || data.id.length > 6) {
      return res.status(400).send({
        success: false,
        message: "id must be 6 digits"
      });
    }
    if (_.isEmpty(data.password || data.id)) {
      return res.status(400).send({
        success: false,
        error: "Must provide studentid and password"
      });
    }
    const exists = await userModel.findOne({ id: data.id });
    if (exists) {
      return res.status(200).send({
        success: false,
        error: "User already exists"
      });
    }
    try {
      const user = await userModel.create(data);
      return res.status(200).send({
        success: true,
        id: user._id,
        type: user.role
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
      id: req.body.id,
      password: req.body.password
    };
    if (_.isEmpty(data.password || data.id)) {
      return res.status(400).send({
        success: false,
        error: "Must provide id and password"
      });
    }

    const user = await userModel.findOne({ id: data.id });
    if (!user) {
      return res.status(200).send({
        success: false,
        error: "user does not exist"
      });
    }
    const verifyPassword = bcrypt.compareSync(data.password, user.password);
    if (!verifyPassword) {
      return res.status(400).send({
        success: false,
        message: "id or password is invalid"
      });
    }
    try {
      const token = await user.generateToken();
      const tokenData = { token: token, userid: data.id };
      await tokenModel.create(tokenData);
      if (user.role === "dean") {
        await sessionModel.deleteMany({ booked: { $lt: moment() } });
        const sessions = await sessionModel.find();
        return res.status(200).send({
          message: "Login successful",
          deanid: user.id,
          token: token,
          sessions: sessions
        });
      }
      return res.status(200).send({
        message: "Login successful",
        studentid: user.id,
        token: token
      });
    } catch (err) {
      logger.error(err);
      return res.status(400).send({
        message: "Login error",
        error: err.message
      });
    }
  }

  async bookSession(req, res) {
    if (req.user.role === "dean") {
      return res.status(400).send({
        success: false,
        message: "Only students can book sessions"
      });
    }
    try {
      const data = {
        booked: req.body.date,
        id: req.user.id
      };

      if (!data.booked || !data.id) {
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
        studentid: data.id,
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

export default new UserController();
