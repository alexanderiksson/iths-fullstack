import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    if (!token) {
        res.status(200).json({ loggedIn: false });
        return;
    }

    try {
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            res.status(500).json({ error: "JWT secret not configured" });
            return;
        }

        const user = jwt.verify(token, jwtSecret);

        (req as any).user = user;

        next();
        return;
    } catch {
        res.status(200).json({ loggedIn: false });
        return;
    }
}
