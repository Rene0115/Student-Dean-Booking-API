import cors from "cors";
import morgan from "morgan";
import express from "express";
import router from "../routes/router.js";

const middleware = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));
  app.use(cors());
  app.use(router);
};

export default middleware;
