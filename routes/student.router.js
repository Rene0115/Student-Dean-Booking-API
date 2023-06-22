import express from "express";
import studentController from "../controller/student.controller.js";
import auth from "../middleware/auth.middleware.js";

const studentRouter = express.Router();

studentRouter.post("/create", studentController.create);
studentRouter.post("/login", studentController.login);
studentRouter.post("/book", auth ,studentController.bookSession);
export default studentRouter;
