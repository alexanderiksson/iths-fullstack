import express from "express";
import bcrypt from "bcrypt";
import client from "../postgres";
import jwt from "jsonwebtoken";
import auth from "../middlewares/auth";

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET as string | undefined;

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

router.get("/check-auth", auth, (req, res) => {
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
            res.status(401).send("Incorrect username");
            return;
        }

        const hashedPassword = user.rows[0].password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatch) {
            res.status(401).send("Incorrect password");
            return;
        }

        if (!jwtSecret) {
            console.error("JWT_SECRET is not defined");
            res.sendStatus(500);
            return;
        }

        const token = jwt.sign({ username }, jwtSecret, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
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
