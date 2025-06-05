import { Request, Response } from "express";
import pool from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export const checkAuth = async (req: Request, res: Response) => {
    res.json({ loggedIn: true, user: req.user });
};

export const register = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.sendStatus(400);
        return;
    }

    if (!jwtSecret) {
        console.error("JWT_SECRET saknas");
        res.sendStatus(500);
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
            "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
            [username, hash]
        );

        const token = jwt.sign({ username, id: result.rows[0].id }, jwtSecret as string);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "dev",
            sameSite: "strict",
        });

        res.status(201).json({ id: result.rows[0].id, username: result.rows[0].username });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.sendStatus(400);
        return;
    }

    if (!jwtSecret) {
        console.error("JWT_SECRET saknas");
        res.sendStatus(500);
        return;
    }

    try {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rows.length === 0) {
            res.sendStatus(401);
            return;
        }

        const hashedPassword = user.rows[0].password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatch) {
            res.sendStatus(401);
            return;
        }

        const token = jwt.sign(
            { username, id: user.rows[0].id, profile_picture: user.rows[0].profile_picture },
            jwtSecret as string
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "dev",
            sameSite: "strict",
        });

        res.status(200).json({ id: user.rows[0].id, username: user.rows[0].username });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const logout = async (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "dev",
        sameSite: "strict",
    });

    res.sendStatus(200);
};
