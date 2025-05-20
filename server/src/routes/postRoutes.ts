import express from "express";
import pool from "../db";
import auth from "../middlewares/auth";

const router = express.Router();

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

export default router;
