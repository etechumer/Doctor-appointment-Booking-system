import express from "express";
import { getAllDoctorsController } from "../controlllers/landingPageController.js";

const landingRouter = express.Router();

landingRouter.get("/get/all-doctors", getAllDoctorsController);

export default landingRouter;
