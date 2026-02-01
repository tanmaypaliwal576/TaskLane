//Imports
import express from "express";
import connectDB from "./connection/mongo.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authroutes from "./routes/auth.routes.js";
import userroutes from "./routes/user.routes.js";
import managerroutes from "./routes/manager.routes.js";
dotenv.config();

//app
const app = express();

//middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

//routes
app.use("/api/auth", authroutes);
app.use("/api/users", userroutes);
app.use("/api/manager", managerroutes);

//connection
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is Running on", PORT);
});
