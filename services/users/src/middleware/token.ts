import jwt from "jsonwebtoken";
import { Response } from "express";
import type { CookieOptions } from "express";
import { JWT_EXPIRES_IN, JWT_SECRET, NODE_ENV } from "../utils/env.js";

/* ---------- Helpers ---------- */
const parseExpiryToMs = (exp?: string) => {
  if (!exp) return 7 * 24 * 60 * 60 * 1000; // default 7 days

  const map: any = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  const match = exp.match(/^(\d+)([smhd])$/);

  return match ? Number(match[1]) * map[match[2]] : 7 * 24 * 60 * 60 * 1000;
};

const signToken = (id: string) =>
  jwt.sign({ id }, JWT_SECRET as string, {
    expiresIn: (JWT_EXPIRES_IN as any) || "7d",
  });

const getCookieOptions = (): CookieOptions => {
  const isProd = String(NODE_ENV).toLowerCase() === "production";

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: parseExpiryToMs(JWT_EXPIRES_IN),
    path: "/",
  };
};

/* ---------- Main Function ---------- */
interface UserDocument {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  bio?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  createdAt?: Date;
  toObject?: () => any;
}

export const createSendToken = (
  user: UserDocument,
  statusCode: number,
  res: Response,
  message: string
) => {
  const token = signToken(user._id);

  // set cookie
  res.cookie("token", token, getCookieOptions());

  const u = user.toObject ? user.toObject() : user;

  const safeUser = {
    _id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    image: u.image,
    bio: u.bio,
    instagram: u.instagram,
    facebook: u.facebook,
    linkedin: u.linkedin,
    createdAt: u.createdAt,
  };

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    data: { user: safeUser },
  });
};