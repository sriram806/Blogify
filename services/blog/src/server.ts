import express from "express";
import dotenv from "dotenv";
import Router from "./routers/blog.router.js";
import redisClient from "./config/redisDB.js";
import { startCacheConsumer } from "./utils/consumer.js";
dotenv.config(); 

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

startCacheConsumer();

app.get("/", (req, res) => {
  res.send("Blog Service is running on port " + PORT);
});

app.use("/api/v1/blog", Router);

const startServer = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to REDIS DATABASE");

    app.listen(PORT, () => {
      console.log(`Blog Server running on port -> 'http://localhost:${PORT}'`);
    });

  } catch (error: any) {
    console.error("Failed to connect to Redis:", error.message);
  }
};

startServer();
