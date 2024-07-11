import User from "../models/userModel.js";
import sendMailOtp from "../utils/nodeMailer.js";
import Otp from "../models/otpModel.js";
import securePassword from "../utils/securePassword.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let otpId;
export const userSignup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const userExist = await User.findOne({ email: email });
    const hashedPassword = await securePassword(password);
    if (userExist) {
      return res
        .status(401)
        .json({ message: "User already registered with this email" });
    }

    const user = new User({
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
    });
    const userData = await user.save();
    otpId = await sendMailOtp(userData.name, userData.email, userData._id);

    return res.status(201).json({
      message: `Otp has been send to ${email}`,
      user: userData,
      otpId: otpId,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const emailOtpVerification = async (req, res) => {
  try {
    const { otp, userId } = req.body;
    const otpData = await Otp.find({ userId: userId });
    const { expiresAt } = otpData[otpData.length - 1];
    const correctOtp = otpData[otpData.length - 1].otp;
    if (otpData && expiresAt < Date.now) {
      return res.status(401).json({ message: "Email OTP has expired" });
    }
    if (correctOtp === otp) {
      await Otp.deleteMany({ userId: userId });
      await User.updateOne({ _id: userId }, { $set: { isVerified: true } });
      res.status(200).json({
        status: true,
        message: "User registered successfully,You can login now",
      });
    } else {
      res.status(400).json({ status: false, message: "Incorrect OTP" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const { _id, name, email } = await User.findOne({ email: userEmail });
    const otpId = sendMailOtp(name, email, _id);
    if (otpId) {
      res.status(200).json({ message: `An OTP has been resent to ${email}` });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Failed to send OTP. Please try again later.",
    });
  }
};

export const loginVerification = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "User not registered" });
    }
    if (user.isVerified) {
      const correctPassword = await bcrypt.compare(password, user.password);
      if (correctPassword) {
        const token = jwt.sign(
          { name: user.name, email: user.email, id: user._id, role: "user" },
          process.env.USER_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({ user, token, message: `Welcome ${user.name}` });
      } else {
        return res.status(403).json({ message: "Incorrect Password" });
      }
    } else {
      return res.status(401).json({ message: "Email is not verified" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


