import express from "express";
import studentRouter from "./student.router.js";
const router = express.Router();

router.use("/student", studentRouter);

export default router;
