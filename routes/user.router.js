import express from "express";
import userController from "../controller/user.controller.js";
import auth from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/create", userController.create);
userRouter.post("/login", userController.login);
userRouter.post("/book", auth ,userController.bookSession);
export default userRouter;
