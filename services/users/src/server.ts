import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./utils/database.js";
import UserRouter from "./routes/user.routes.js";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import type { CorsOptions } from "cors";

dotenv.config();

const app = express();
const allowedOrigins = [
    "http://localhost:3000",
    "https://blogify-three-phi.vercel.app",
    process.env.CLIENT_ORIGIN
].filter((origin): origin is string => Boolean(origin));

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
const PORT = process.env.PORT || 5000;

const appVersion = "v1";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.API,
    api_secret: process.env.API_Secret,
})

app.get("/", (req: Request, res: Response) => {
    res.send("User Service is up and running on port number "+ PORT + "!");
});

app.use(`/api/${appVersion}/users`, UserRouter);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`User service is running on port -> http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start user service:", error);
        process.exit(1);
    }
};

startServer();