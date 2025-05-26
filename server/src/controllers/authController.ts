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
};

export const login = async (req: Request, res: Response) => {
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
};

export const logout = async (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
    });

    res.sendStatus(200);
};
