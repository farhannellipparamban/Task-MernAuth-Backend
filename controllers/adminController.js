import User from "../models/userModel.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const adminLogin = (req, res) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const userName = "Admin";
  try {
    const { email, password } = req.body;
    if (adminEmail === email) {
      if (adminPassword === password) {
        const token = jwt.sign(
          {
            name: userName,
            email: adminEmail,
            role: "admin",
          },
          process.env.ADMIN_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res
          .status(200)
          .json({ userName, token, message: `Welome ${userName}` });
      } else {
        res.status(403).json({ message: "Incorrect Password" });
      }
    } else {
      res.status(401).json({ message: "Incorrect email" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: "Internal Server Error" });
  }
};

export const usersList = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: "Internal Server Error" });
  }
};
