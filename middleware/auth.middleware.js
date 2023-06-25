import tokenModel from "../models/token.model.js";
import userModel from "../models/user.model.js";
import { logger } from "../app.js";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.query.token;

    if (!token) {
      return res.status(403).send({
        success: false,
        message: "Missing authentication token"
      });
    }
    const authTokenModel = await tokenModel.findOne({ token: token });

    const user = await userModel.findOne({
      id: authTokenModel.userid
    });

    if (!user || !authTokenModel) {
      return res.status(401).send({
        success: false,
        message: "Invalid authentication token"
      });
    }

    req.user = user;

    next();
  } catch (error) {
    logger.error(error);
    return res.status(500).send({
      success: false,
      error: "Internal server error"
    });
  }
};

export default auth;
