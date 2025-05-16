import { Request, Response, NextFunction } from "express";
import express from "express";
import bcrypt from "bcrypt";
import client from "../postgres";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const SECRET = "hemlig_nyckel";

const router = express.Router();

function authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if (!token) {
        res.status(200).json({ loggedIn: false });
        return;
    }

    try {
        const user = jwt.verify(token, SECRET);
        (req as any).user = user;
        next();
        return;
    } catch {
        res.status(403).json({ loggedIn: false });
        return;
    }
}

router.get("/check-auth", authenticate, (req, res) => {
    res.json({ loggedIn: true, user: req.user });
});

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).send("Username & password is required");
        return;
    }

    try {
        const user = await client.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (user.rows.length > 0) {
            res.status(409).send("Username is already taken");
            return;
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }

    try {
        const hash = await bcrypt.hash(password, 10);

        await client.query(
            "INSERT INTO users (username, password) VALUES ($1, $2)",
            [username, hash]
        );

        res.sendStatus(201);
        return;
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.sendStatus(400);
        return;
    }

    try {
        const user = await client.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (user.rows.length === 0) {
            res.status(400).send("Incorrect username");
            return;
        }

        const hashedPassword = user.rows[0].password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatch) {
            res.status(400).send("Incorrect password");
            return;
        }

        const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });

        res.sendStatus(200);
        return;
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }
});

export default router;
