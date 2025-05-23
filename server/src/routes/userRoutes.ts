import express from "express";
import bcrypt from "bcrypt";
import pool from "../db";
import jwt from "jsonwebtoken";
import auth from "../middlewares/auth";

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

router.get("/check-auth", auth, (req, res) => {
    res.json({ loggedIn: true, user: req.user });
});

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).send("Användarnamn & lösenord är obligatoriskt");
        return;
    }

    try {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

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
        const hash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
            [username, hash]
        );

        if (!jwtSecret) {
            console.error("JWT_SECRET is not defined");
            res.sendStatus(500);
            return;
        }

        const token = jwt.sign({ username, id: result.rows[0].id }, jwtSecret, { expiresIn: "1h" });

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

    if (!username || !password) {
        res.sendStatus(400);
        return;
    }

    try {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

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

        const token = jwt.sign({ username, id: user.rows[0].id }, jwtSecret, { expiresIn: "1h" });

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
        const userInfo = await pool.query("SELECT id, username FROM users WHERE id = $1", [user]);

        const followers = await pool.query("SELECT * FROM users_follows WHERE follows = $1", [
            user,
        ]);

        const follows = await pool.query("SELECT * FROM users_follows WHERE user_id = $1", [user]);

        const posts = await pool.query("SELECT * FROM posts WHERE user_id = $1", [user]);

        const postIds = posts.rows.map((post) => post.id);
        let likes = [];
        if (postIds.length > 0) {
            const likesResult = await pool.query(
                "SELECT * FROM users_likes WHERE post_id = ANY($1::int[])",
                [postIds]
            );
            likes = likesResult.rows;
        }

        const postsWithLikes = posts.rows.map((post) => ({
            ...post,
            likes: likes.filter((like) => like.post_id === post.id).map((like) => like.user_id),
        }));

        if (userInfo.rows.length === 0) {
            res.sendStatus(404);
            return;
        }

        const data = {
            id: userInfo.rows[0].id,
            username: userInfo.rows[0].username,
            followers: followers.rows.map((follower) => follower.user_id),
            follows: follows.rows.map((follow) => follow.follows),
            posts: [...postsWithLikes],
        };

        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }
});

router.get("/me", auth, (req, res) => {
    const user = req.user;
    res.json({ id: user?.id, username: user?.username });
});

router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
    });

    res.sendStatus(200);
});

router.get("/search-users", auth, async (req, res) => {
    const query = req.query.query;

    if (!query) {
        res.sendStatus(400);
        return;
    }

    try {
        const result = await pool.query("SELECT id, username FROM users WHERE username ILIKE $1", [
            `%${query}%`,
        ]);
        res.json(result.rows);
        return;
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }
});

export default router;
