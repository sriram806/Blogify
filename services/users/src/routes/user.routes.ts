import express, { Request, Response } from "express";
import { currentUser, GetProfile, Login, Logout, Registration, UpdateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/isAuth.js";

const UserRouter = express.Router();

UserRouter.get("/", (req: Request, res: Response) => {
    res.send("User Service routes is up and running");
});

UserRouter.post("/register", Registration);
UserRouter.post("/login", Login);
UserRouter.post("/logout", Logout);
UserRouter.get("/getUserDetails/:userId", isAuthenticated, GetProfile);
UserRouter.get("/profile", isAuthenticated, currentUser);
UserRouter.put("/profile/:userId", isAuthenticated, UpdateProfile);

export default UserRouter;