import express from "express";
import pool from "../db/index.js";

const router = express.Router();

router.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
        return;
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        return;
    }
});

router.get("/posts", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM posts");
        res.json(result.rows);
        return;
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        return;
    }
});

router.get("/follows", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users_follows");
        res.json(result.rows);
        return;
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        return;
    }
});

router.get("/likes", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users_likes");
        res.json(result.rows);
        return;
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        return;
    }
});

router.get("/comments", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users_comments");
        res.json(result.rows);
        return;
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        return;
    }
});

export default router;
