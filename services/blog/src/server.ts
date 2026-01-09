import express from "express";
import dotenv from "dotenv";
import Router from "./routers/blog.router.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5002;

app.use("/api/v1/blog", Router);

app.listen(PORT, ()=>{
    console.log(`Blog Server is running on port ${PORT} ->  "http://localhost:${PORT}"`);
})