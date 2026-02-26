import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cloudinary from "./src/config/cloudinary.js";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import AuthRouter from "./src/routers/authRouter.js";
import UserRouter from "./src/routers/UserRouter.js"
import aiRoutes from "./src/routers/aiRouter.js"



const app = express();

app.use(cors({ origin: ["http://localhost:5173","https://vermillion-griffin-998a4f.netlify.app"], credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));


app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/api/v1/ai", aiRoutes)


app.get("/", (req, res) => {
  console.log("Server is Working");
  res.send("Server is Working");
});

app.use((err, req, res, next) => {
  const ErrorMessage = err.message || "Internal Server Error";
  const StatusCode = err.statusCode || 500;
  console.log("Error Found", { ErrorMessage, StatusCode });

  res.status(StatusCode).json({ message: ErrorMessage });
});

const port = process.env.PORT || 5000;
app.listen(port, async () => {
  console.log("Server started at port:", port);
  connectDB();

  try {
    const res = await cloudinary.api.ping();
    console.log("Cloudinary API is working", res);
  } catch (error) {
    console.error("Error Connection Cloudinary API", error);
  }
});
