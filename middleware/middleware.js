import cors from "cors"
import morgan from "morgan"
import express from "express"

const middleware = (app)=>{
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('dev'));
    app.use(cors());
}

export default middleware;