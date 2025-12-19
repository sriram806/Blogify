import express from "express";
import { Login, Logout, Registration } from "../controllers/user.controller.js";

const UserRouter = express.Router();

UserRouter.get("/", (req, res) => {
    res.send("User Service routes is up and running");
});

UserRouter.post("/register", Registration);
UserRouter.post("/login", Login);
UserRouter.post("/logout", Logout);

export default UserRouter;