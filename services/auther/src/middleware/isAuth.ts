import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

declare global {
    namespace Express {
        interface Request {
            user?: { id: string };
        }
    }
}

interface DecodedToken extends JwtPayload {
    id: string;
}

const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    const token =
        req.cookies?.token ||
        req.headers.authorization?.split(" ")[1] ||
        req.query.token;

    if (!token) {
        res.status(401).json({ success: false, message: "Access denied. No token provided." });
        return;
    }

    try {
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as DecodedToken;
        req.user = { id: decoded.id };
        next();
    } catch (err: any) {
        const message =
            err.name === "TokenExpiredError"
                ? "Token expired. Please login again."
                : "Invalid token. Please login again.";
        res.status(401).json({ success: false, message });
    }
};

export default isAuthenticated;
