import express from "express";
import { CreateDoctorController } from "../controlllers/adminController.js";
import {
  updateDoctorInfoController,
  getDoctorInfoController,
  getPendingAppointmentscontroller,
  approveAppointmentController,
  rejectAppointmentController,
  getRejectedAppointmentscontroller,
  getBookedAppointmentscontroller,
  getAllDoctorCountsController,
} from "../controlllers/doctorContorller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const doctorRouter = express.Router();

doctorRouter.put("/update/info", authMiddleware, updateDoctorInfoController);
doctorRouter.get("/get/info", authMiddleware, getDoctorInfoController);
doctorRouter.get(
  "/appointments/pending",
  authMiddleware,
  getPendingAppointmentscontroller,
);
doctorRouter.put(
  "/appointments/approve/:id",
  authMiddleware,
  approveAppointmentController,
);
doctorRouter.put(
  "/appointments/reject/:id",
  authMiddleware,
  rejectAppointmentController,
);
doctorRouter.get(
  "/appointments/reject/all",
  authMiddleware,
  getRejectedAppointmentscontroller,
);
doctorRouter.get(
  "/appointments/booked/all",
  authMiddleware,
  getBookedAppointmentscontroller,
);
doctorRouter.get(
  "/dashboard/counts",
  authMiddleware,
  getAllDoctorCountsController,
);
export default doctorRouter;
