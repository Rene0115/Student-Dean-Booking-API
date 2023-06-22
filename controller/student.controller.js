import bcrypt from "bcrypt";
import studentModel from "../models/student.model.js";
import { logger } from "../app.js";
import _ from "lodash";

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
        data: student
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
