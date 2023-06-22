import cors from "cors";
import morgan from "morgan";
import express from "express";
import router from "../routes/router.js";
import errorHandler from "./error.middleware.js";

const middleware = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));
  app.use(cors());
  app.use(router);
  app.use(errorHandler);
};

export default middleware;
