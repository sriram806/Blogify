import express from "express";
import { getallBlogs, getBlogById } from "../controllers/blog.controller.js";

const Router = express.Router();

Router.get("/", async (req, res) => {
    res.status(200).json({ message: "Blog API is working!" });
});

Router.get("/all-blogs", getallBlogs);
Router.get("/blog/:id", getBlogById);
export default Router;