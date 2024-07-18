import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnect from "./config/mongodb.js";
import userRoute from "./routes/userRoutes.js";
import adminRoute from "./routes/adminRoute.js";

dotenv.config();
dbConnect();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/", userRoute);
app.use("/admin", adminRoute);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
