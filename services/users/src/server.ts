import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./utils/database.js";
import UserRouter from "./routes/user.routes.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const appVersion = "v1";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();
cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.API,
    api_secret: process.env.API_Secret,
})

app.get("/", (req: Request, res: Response) => {
    res.send("User Service is up and running on port number "+ PORT + "!");
});

app.use(`/api/${appVersion}/users`, UserRouter);

app.listen(PORT, () => {
    console.log(`User service is running on port -> http://localhost:${PORT}`);
});