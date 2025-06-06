import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
    interface Request {
        user?: {
            id: number;
            username: string;
            profile_picture: string;
        };
    }
}

interface AuthPayload extends JwtPayload {
    id: number;
    username: string;
}

function isAuthPayload(payload: JwtPayload): payload is AuthPayload {
    return typeof payload.id === "number" && typeof payload.username === "string";
}

export default function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.token;

    if (!token || typeof token !== "string") {
        res.status(401).json({ loggedIn: false });
        return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        res.status(500).json({ error: "JWT secret not configured" });
        return;
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);

        if (typeof decoded === "object" && decoded !== null && isAuthPayload(decoded)) {
            req.user = {
                id: decoded.id,
                username: decoded.username,
                profile_picture: decoded.profile_picture,
            };
            next();
            return;
        }

        req.user = undefined;
        res.status(401).json({ loggedIn: false });
    } catch (err) {
        req.user = undefined;
        console.error(err);
        res.status(401).json({ loggedIn: false });
    }
}
