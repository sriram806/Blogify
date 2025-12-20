import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../model/user.model.js";
import { JWT_SECRET } from "../utils/env.js";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            tokenSource?: "cookie" | "header" | "query" | "none";
        }
    }
}

interface DecodedToken extends JwtPayload {
    id: string;
}

const extractToken = (req: Request): { token: string | null; source: Request["tokenSource"] } => {
    if (req.cookies?.token) {
        return { token: req.cookies.token as string, source: "cookie" };
    }

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
        return { token: authHeader.split(" ")[1], source: "header" };
    }

    if (typeof req.query.token === "string") {
        return { token: req.query.token, source: "query" };
    }

    return { token: null, source: "none" };
};

const maskToken = (token: string | null): string => {
    if (!token) return "null";
    return token.length > 10
        ? `${token.slice(0, 6)}...${token.slice(-6)}`
        : token;
};

const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token, source } = extractToken(req);

        const ip = req.ip || (req.headers["x-forwarded-for"] as string) || "unknown";

        const origin = req.headers.origin || req.headers.referer || "unknown";

        console.log("------ AUTH CHECK START ------");
        console.log("Request Path:", req.originalUrl);
        console.log("Token Source:", source);
        console.log("Masked Token:", maskToken(token));
        console.log("IP:", ip);
        console.log("Origin:", origin);

        if (!token) {
            console.log("❌ No token provided");
            console.log("------ AUTH CHECK END ------");

            res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
            return;
        }

        let decoded: DecodedToken;

        try {
            decoded = jwt.verify(token, JWT_SECRET as string) as unknown as DecodedToken;
            console.log("✔ Token verified. User ID:", decoded.id);
        } catch (err: any) {
            console.error("❌ JWT Error:", err.name);

            const message =
                err.name === "TokenExpiredError"
                    ? "Token expired. Please login again."
                    : err.name === "JsonWebTokenError"
                        ? "Invalid token. Please login again."
                        : "Unauthorized access.";

            console.log("------ AUTH CHECK END ------");

            res.status(401).json({ success: false, message });
            return;
        }

        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            console.log("❌ User not found:", decoded.id);
            console.log("------ AUTH CHECK END ------");

            res.status(401).json({
                success: false,
                message: "User associated with this token no longer exists.",
            });
            return;
        }

        req.user = currentUser;
        req.tokenSource = source;

        console.log("✔ Authenticated User:", currentUser.email);
        console.log("------ AUTH CHECK END ------");

        next();
    } catch (error) {
        console.error("🔥 Auth middleware error:", error);
        console.log("------ AUTH CHECK END (ERROR) ------");

        res.status(500).json({
            success: false,
            message: "Internal server error during authentication.",
        });
    }
};

export default isAuthenticated;
