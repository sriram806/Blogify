import { Request, Response } from "express";

export const loginUser = async (req:Request, res: Response) =>{
    try {
        const { email, password } = req.body;
    } catch (error:any) {
        res.status(500).json({message: "Internal Server Error"});
    }
}