import studentModel from "../models/student.model.js";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.query.token;
 console.log(token)
    if (!token) {
      return res.status(403).send({
        success: false,
        message: "Missing authentication token"
      });
    }

    const student = await studentModel.findOne({ token: token });

    if (!student) {
      return res.status(401).send({
        success: false,
        message: "Invalid authentication token"
      });
    }

    req.student = student;

    next();
  } catch (error) {
    logger.error(error);
    return res.status(500).send({
      success: false,
      error: "Internal server error"
    });
  }
};

export default auth
