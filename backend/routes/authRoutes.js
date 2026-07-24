import express from "express";
import {
  RegisterPatientController,
  loginController,
  getUserController,
  updateUserController,
  updatePasswordController,
  sendMessageController,
  getChatHistoryController,
} from "../controlllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register/patient", RegisterPatientController);
authRouter.post("/login", loginController);
authRouter.get("/getUser", authMiddleware, getUserController);
authRouter.put("/updateUser", authMiddleware, updateUserController);
authRouter.put("/updatePassword", authMiddleware, updatePasswordController);
authRouter.post("/sendMessage", authMiddleware, sendMessageController);
authRouter.get(
  "/getMessages/:appointmentId",
  authMiddleware,
  getChatHistoryController,
);
export default authRouter;
