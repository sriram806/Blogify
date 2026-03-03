import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Router from "./routers/blog.router.js";
import redisClient from "./config/redisDB.js";
import { startCacheConsumer } from "./utils/consumer.js";
dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://blogify-three-phi.vercel.app",
  process.env.CLIENT_ORIGIN
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: allowedOrigins as any,
    credentials: true,
  })
);
app.use(express.json());

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Blog Service is running on port " + PORT);
});

app.use("/api/v1/blog", Router);

const connectRedis = async () => {
  while (!redisClient.isReady) {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      console.log("Connected to REDIS DATABASE");
      startCacheConsumer();
      return;
    } catch (error: any) {
      console.error("Redis connection attempt failed:", error.message);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
};

const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Blog Server running on port -> 'http://localhost:${PORT}'`);
  });

  connectRedis();
};

startServer();
