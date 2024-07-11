import express from "express"
import { emailOtpVerification, loginVerification, resendOtp, userSignup } from "../controllers/userController.js"


const userRoute = express()

userRoute.post("/signup",userSignup)
userRoute.post("/otp",emailOtpVerification)
userRoute.post("/resendOtp",resendOtp)
userRoute.post("/login",loginVerification)

export default userRoute