import express from "express";
import { adminLogin, usersList } from "../controllers/adminController.js";
import { adminTokenVerify } from "../middleware/authVerify.js";

const adminRoute = express();

adminRoute.post("/login", adminLogin);
adminRoute.get("/userList", adminTokenVerify, usersList);

export default adminRoute;
