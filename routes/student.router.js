import express from "express";
import studentController from "../controller/student.controller.js";

const studentRouter = express.Router();

studentRouter.post('/create', studentController.create)

export default studentRouter;
