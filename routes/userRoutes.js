import express from "express";
import {
  emailOtpVerification,
  forgetPassword,
  loginVerification,
  resendOtp,
  resetPassword,
  userSignup,
} from "../controllers/userController.js";

const userRoute = express();

userRoute.post("/signup", userSignup);
userRoute.post("/otp", emailOtpVerification);
userRoute.post("/resendOtp", resendOtp);
userRoute.post("/login", loginVerification);
userRoute.post("/forgetPassword", forgetPassword);
userRoute.put("/resetPassword/:id/:token", resetPassword);

export default userRoute;
