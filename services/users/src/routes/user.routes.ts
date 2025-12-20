import express, { Request, Response } from "express";
import { GetProfile, Login, Logout, Registration } from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/isAuth.js";

const UserRouter = express.Router();

UserRouter.get("/", (req: Request, res: Response) => {
    res.send("User Service routes is up and running");
});

UserRouter.post("/register", Registration);
UserRouter.post("/login", Login);
UserRouter.post("/logout", Logout);
UserRouter.get("/getUserDetails", isAuthenticated, GetProfile);

export default UserRouter;