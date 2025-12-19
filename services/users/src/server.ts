import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/database.js";
import UserRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const appVersion = "v1";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => {
    res.send("User Service is up and running!");
});

app.use(`/api/${appVersion}/users`, UserRouter);

app.listen(PORT, () => {
    console.log(`User service is running on port -> http://localhost:${PORT}`);
});