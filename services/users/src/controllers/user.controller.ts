import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../model/user.model.js";
import { createSendToken } from "../middleware/token.js";

export const Registration = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) return res.status(400).json({ success: false, message: "Please provide all required fields" });
        if (await User.findOne({ email })) return res.status(409).json({ success: false, message: "User already exists with this email" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        const userObject = {
            ...createdUser.toObject(),
            _id: createdUser._id.toString(),
        };

        return createSendToken(userObject, 201, res, "User registered successfully");
    } catch (error: any) {
        console.error("Registration Error:", error);
        return res.status(500).json({ success: false, message: `Internal Server Error in Registration: ${error.message}` });
    }
};

export const Login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    try {
        if (!email || !password) return res.status(400).json({ success: false, message: "Please provide email and password" });
        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        if (!(await bcrypt.compare(password, user.password))) return res.status(401).json({ success: false, message: "Invalid password" });

        const userObject = {
            ...user.toObject(),
            _id: user._id.toString(),
        }

        return createSendToken(userObject, 200, res, "Login successful");
    } catch (error: any) {
        return res.status(500).json({ success: false, message: `Internal Server Error in Login: ${error.message}` });
    }
}

export const Logout = async (req: Request, res: Response): Promise<Response> => {
    try {
        res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: `Internal Server Error in Logout: ${error.message}` });
    }
};

export const GetProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.user?._id;
        
        if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });
        
        const user = await User.findById(userId);
        
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        
        const userObject = {
            ...user.toObject(),
            _id: user._id.toString(),
        };
        
        return res.status(200).json({ success: true, data: userObject });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: `Internal Server Error in GetProfile: ${error.message}` });
    }
};