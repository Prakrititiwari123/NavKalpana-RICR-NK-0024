import express from "express";
import {
  UserRegister,
  UserLogin,
  UserLogout,
  UserGenOTP,
  UserVerifyOtp,
  UserForgetPassword,
  deleteAccount,
} from "../controllers/authController.js";
import { checkUserActive, OtpProtect, Protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", UserLogin);
router.get("/logout", UserLogout);

router.post("/genOtp", UserGenOTP);
router.post("/verifyOtp", UserVerifyOtp);
router.post("/forgetPassword", OtpProtect, UserForgetPassword);

router.delete('/delete-account', Protect, deleteAccount);
router.delete('/delete-account', Protect, deleteAccount);

export default router;
