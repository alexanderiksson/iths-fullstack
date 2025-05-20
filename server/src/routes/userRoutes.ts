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

    // Kolla om användarnamn och lösenord är ifyllt
    if (!username || !password) {
        res.status(400).send("Användarnamn & lösenord är obligatoriskt");
        return;
    }

    try {
        // Leta efter användarnamn i databas
        const user = await client.query("SELECT * FROM users WHERE username = $1", [username]);

        // Kolla om användarnamnet är upptaget
        if (user.rows.length > 0) {
            res.status(409).send("Användarnamnet är upptaget");
            return;
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }

    try {
        // Skapa hash av lösenordet
        const hash = await bcrypt.hash(password, 10);

        // Spara användaren i databasen
        await client.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
            username,
            hash,
        ]);

        if (!jwtSecret) {
            console.error("JWT_SECRET is not defined");
            res.sendStatus(500);
            return;
        }

        // Generera en ny token åt användaren
        const token = jwt.sign({ username }, jwtSecret, { expiresIn: "1h" });

        // Skicka cookie till klienten med token
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
        });

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

    // Kolla om användarnamn och lösenord är ifyllt
    if (!username || !password) {
        res.sendStatus(400);
        return;
    }

    try {
        // Försök hämta användaren från databasen
        const user = await client.query("SELECT * FROM users WHERE username = $1", [username]);

        // Kolla om användaren finns
        if (user.rows.length === 0) {
            res.status(401).send("Incorrect username");
            return;
        }

        const hashedPassword = user.rows[0].password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        // Kolla om lösendords hashen matchar
        if (!passwordMatch) {
            res.status(401).send("Incorrect password");
            return;
        }

        if (!jwtSecret) {
            console.error("JWT_SECRET is not defined");
            res.sendStatus(500);
            return;
        }

        // Generera en ny token åt användaren
        const token = jwt.sign({ username, id: user.rows[0].id }, jwtSecret, { expiresIn: "1h" });

        // Skicka cookie till klienten med token
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

router.get("/user/:user", auth, async (req, res) => {
    const user = req.params.user;

    try {
        const userInfo = await client.query("SELECT id, username FROM users WHERE id = $1", [user]);

        const followers = await client.query("SELECT * FROM users_follows WHERE follows = $1", [
            user,
        ]);

        const follows = await client.query("SELECT * FROM users_follows WHERE user_id = $1", [
            user,
        ]);

        const posts = await client.query("SELECT * FROM posts WHERE user_id = $1", [user]);

        const data = {
            id: userInfo.rows[0].id,
            username: userInfo.rows[0].username,
            followers: followers.rows.map((follower) => follower.user_id),
            follows: follows.rows.map((follow) => follow.follows),
            posts: [...posts.rows],
        };

        res.status(200).json(data);
    } catch (err) {}
});

router.get("/me", auth, (req, res) => {
    const { id, username } = req.user;
    res.json({ id, username });
});

router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
    });

    res.sendStatus(200);
});

export default router;
