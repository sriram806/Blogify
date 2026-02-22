import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../model/user.model.js";
import { createSendToken } from "../middleware/token.js";
import getBuffer from "../utils/buffer.service.js";
import { v2 as cloudinary } from "cloudinary";
import { oauth2Client } from "../utils/GoogleConfig.js";
import axios from "axios";

// register a new user
export const Registration = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { code, name, email, password, role } = req.body;

    // 🔹 LOCAL REGISTRATION
    if (name || email || password) {
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide name, email, and password",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const createdUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || "user",
        provider: "local",
      });

      const userObject = {
        ...createdUser.toObject(),
        _id: createdUser._id.toString(),
      };

      return createSendToken(userObject, 201, res, "User registered successfully");
    }

    // 🔹 GOOGLE REGISTRATION
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code is required for Google registration",
      });
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const userInfo = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    const { email: googleEmail, name: googleName, picture } = userInfo.data;

    let user = await User.findOne({ email: googleEmail });

    if (user) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    user = await User.create({
      name: googleName,
      email: googleEmail,
      image: picture,
      role: role || "user",
      provider: "google",
    });

    const userObject = {
      ...user.toObject(),
      _id: user._id.toString(),
    };

    return createSendToken(userObject, 201, res, "User registered with Google successfully");
  } catch (error: any) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error in Registration: ${error.message}`,
    });
  }
};

export const Login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { code, email, password } = req.body as {
      code?: string;
      email?: string;
      password?: string;
    };

    if (email && password) {
      const user = await User.findOne({ email }).select("+password");

      if (!user || !user.password) {
        return res.status(401).json({
          success: false,
          message: "Account with this email does not exist",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "You have entered an incorrect password",
        });
      }

      const userObject = {
        ...user.toObject(),
        _id: user._id.toString(),
      };

      return createSendToken(userObject, 200, res, "Login successful");
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code or is required",
      });
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const userInfo = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    const { email: googleEmail, name, picture } = userInfo.data;

    let user = await User.findOne({ email: googleEmail });

    if (!user) {
      user = await User.create({
        name,
        email: googleEmail,
        image: picture,
        provider: "google",
      });
    }

    const userObject = {
      ...user.toObject(),
      _id: user._id.toString(),
    };

    return createSendToken(userObject, 200, res, "Google login successful");
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Internal Server Error at Login: ${error.message}`,
    });
  }
};

// logout user
export const Logout = async (req: Request, res: Response): Promise<Response> => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
      expires: new Date(0),
    });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: `Internal Server Error in Logout: ${error.message}` });
  }
};


// get user profile
export const GetProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ success: false, message: "UserId is not provided" });

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

// get current user 
export const currentUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: `Internal Server Error in currentUser: ${error.message}` });
  }
}

// update user profile

export const UpdateProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?._id;

    if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });
    const { name, image, instagram, facebook, linkedin, bio } = req.body;

    const updatedData: any = {};
    if (name) updatedData.name = name;
    if (image) updatedData.image = image;
    if (instagram) updatedData.instagram = instagram;
    if (facebook) updatedData.facebook = facebook;
    if (linkedin) updatedData.linkedin = linkedin;
    if (bio) updatedData.bio = bio;
    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const userObject = {
      ...user.toObject(),
      _id: user._id.toString(),
    };

    return createSendToken(userObject, 200, res, "Profile updated successfully");
  } catch (error: any) {
    return res.status(500).json({ success: false, message: `Internal Server Error in UpdateProfile: ${error.message}` });
  }
}

export const UpdateProfileImage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const fileBuffer = await getBuffer(file);
    if (!fileBuffer) return res.status(400).json({ success: false, message: "Invalid file data" });

    const uploadResult = await cloudinary.uploader.upload(fileBuffer as any, {
      folder: "profile_images",
      resource_type: "image",
    });

    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });

    const user = await User.findByIdAndUpdate(userId, { image: uploadResult.secure_url }, { new: true });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const userObject = {
      ...user.toObject(),
      _id: user._id.toString(),
    };

    return createSendToken(userObject, 200, res, "Profile image updated successfully");
  } catch (error: any) {
    return res.status(500).json({ success: false, message: `Internal Server Error in UpdateProfileImage: ${error.message}` });
  }
}