import express from "express";

const UserRouter = express.Router();

UserRouter.get("/", (req, res) => {
    res.send("User Route is working!");
});

export default UserRouter;