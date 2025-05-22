import express from "express";
import pool from "../db";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/feed", auth, async (req, res) => {
    try {
        const userId = req.user?.id;

        const followsResult = await pool.query(
            "SELECT follows FROM users_follows WHERE user_id = $1",
            [userId]
        );

        const followsIds = followsResult.rows.map((row) => row.follows);

        if (followsIds.length === 0) {
            res.json([]);
            return;
        }

        const postsResult = await pool.query(
            `SELECT posts.*, users.username
             FROM posts
             JOIN users ON posts.user_id = users.id
             WHERE posts.user_id = ANY($1)
             ORDER BY posts.created DESC`,
            [followsIds]
        );

        res.json(postsResult.rows);
        return;
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }
});

router.post("/new-post", auth, async (req, res) => {
    const user = req.user;
    const { text } = req.body;

    if (!text || !user) {
        res.sendStatus(400);
        return;
    }

    try {
        await pool.query("INSERT INTO posts (text, user_id) VALUES ($1, $2)", [text, user.id]);
        res.sendStatus(201);
        return;
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }
});

router.post("/like/:id", auth, async (req, res) => {
    const userId = req.user?.id;
    const postId = req.params.id;

    try {
        await pool.query(
            "INSERT INTO users_likes (user_id, post_id) VALUES ($1, $2 ON CONFLICT DO NOTHING)",
            [userId, postId]
        );
        res.sendStatus(200);
        return;
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }
});

router.delete("/like/:id", auth, async (req, res) => {
    const userId = req.user?.id;
    const postId = req.params.id;

    try {
        await pool.query("DELETE FROM users_likes WHERE user_id = $1 AND post_id = $2", [
            userId,
            postId,
        ]);
        res.sendStatus(200);
        return;
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }
});

export default router;
