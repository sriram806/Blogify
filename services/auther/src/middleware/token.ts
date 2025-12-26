import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";

export const parseExpiryToMs = (expiresIn?: string): number => {
    const def = 7 * 24 * 60 * 60 * 1000; // 7 days

    if (!expiresIn || typeof expiresIn !== "string") return def;

    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return def;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case "s": return value * 1000;
        case "m": return value * 60 * 1000;
        case "h": return value * 60 * 60 * 1000;
        case "d": return value * 24 * 60 * 60 * 1000;
        default: return def;
    }
};

export const signToken = (id: string): string => {
    const options: SignOptions = {
        expiresIn: process.env.JWT_EXPIRES_IN as any || "7d",
    };

    return jwt.sign({ id }, process.env.JWT_SECRET as string, options);
};

interface UserDocument {
    _id: string;
    name: string;
    email: string;
    role: string;
    image?: string;
    createdAt?: Date;
    bio?: string;
    toObject?: () => any;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
}


export const createSendToken = (user: UserDocument, statusCode: number, res: Response, message: string) => {
    const token = signToken(user._id);

    const nodeEnv = String(process.env.NODE_ENV).toLowerCase().trim();
    const isProd = nodeEnv === "production";

    let cookieDomain: string | undefined =process.env.COOKIE_DOMAIN || undefined;

    if (cookieDomain) {
        cookieDomain = cookieDomain.replace(/^https?:\/\//, "").split("/")[0].split(":")[0];

        if (!cookieDomain.startsWith(".")) {
            cookieDomain = `.${cookieDomain}`;
        }

        cookieDomain = cookieDomain.replace(/^\.+/, ".");
    }

    if (
        !cookieDomain ||cookieDomain === "." ||cookieDomain === ".localhost"
    ) {
        cookieDomain = undefined;
    }

    const cookieOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax" as const,
        maxAge: parseExpiryToMs(process.env.JWT_EXPIRES_IN),
        path: "/",
        ...(cookieDomain ? { domain: cookieDomain } : {}),
    };

    try {
        res.cookie("token", token, cookieOptions);
    } catch (cookieErr: any) {
        console.error(
            "createSendToken: cookie set failed -",
            cookieErr?.message,
            "| Options:",
            JSON.stringify(cookieOptions)
        );

        try {
            res.cookie("token", token, {
                httpOnly: true,
                secure: isProd,
                sameSite: "lax",
                maxAge: cookieOptions.maxAge,
                path: "/",
            });
        } catch (err2: any) {
            console.error(
                "createSendToken: fallback cookie set also failed:",
                err2?.message
            );
        }
    }

    const userObj = user.toObject ? user.toObject() : { ...user };

    delete userObj.password;

    const safeUser = {
        _id: userObj._id,
        name: userObj.name,
        email: userObj.email,
        role: userObj.role,
        image: userObj.image,
        instagram: userObj.instagram,
        facebook: userObj.facebook,
        linkedin: userObj.linkedin,
        bio: userObj.bio,
        createdAt: userObj.createdAt,
    };

    return res.status(statusCode).json({
        success: true,
        message,
        token,
        data: { user: safeUser },
    });
};
