import express from "express";
import { getallBlogs, getBlogBySlug } from "../controllers/blog.controller.js";

const Router = express.Router();

Router.get("/", async (req, res) => {
    res.status(200).json({ message: "Blog API is working!" });
});

Router.get("/all-blogs", getallBlogs);
Router.get("/get/:slug", getBlogBySlug);

export default Router;