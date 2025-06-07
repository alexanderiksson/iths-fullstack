import { Request, Response } from "express";
import pool from "../db";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary";
import fs from "fs";

const jwtSecret = process.env.JWT_SECRET;

export const getCurrentUser = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
        res.sendStatus(401);
        return;
    }

    res.json({ id: user.id, username: user.username, profile_picture: user.profile_picture });
};

export const updateUser = async (req: Request, res: Response) => {
    const user = req.user;
    const newUsername = req.body.username;

    if (!user) {
        res.sendStatus(401);
        return;
    }

    if (!newUsername) {
        res.sendStatus(400);
        return;
    }

    try {
        let profilePictureUrl: string | null = null;

        // Om en bild laddats upp
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "iths",
            });

            profilePictureUrl = result.secure_url;

            // Radera temporär fil
            fs.unlinkSync(req.file.path);
        }

        const updateQuery = profilePictureUrl
            ? "UPDATE users SET username = $1, profile_picture = $2 WHERE id = $3 RETURNING id, username, profile_picture"
            : "UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username, profile_picture";

        const queryParams = profilePictureUrl
            ? [newUsername, profilePictureUrl, user.id]
            : [newUsername, user.id];

        const result = await pool.query(updateQuery, queryParams);

        const updatedUser = result.rows[0];

        // Ta bort gamla token
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "dev",
            sameSite: "strict",
        });

        // Signera ny token med nya användarnamnet
        const token = jwt.sign(
            {
                username: updatedUser.username,
                id: updatedUser.id,
                profile_picture: updatedUser.profile_picture,
            },
            jwtSecret as string
        );

        // Skicka tillbaka nya token
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "dev",
            sameSite: "strict",
        });

        res.status(200).json(updatedUser);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const getUser = async (req: Request, res: Response) => {
    const userId = req.params.user;

    try {
        const userInfo = await pool.query(
            "SELECT id, username, profile_picture FROM users WHERE id = $1",
            [userId]
        );

        if (userInfo.rows.length === 0) {
            res.sendStatus(404);
            return;
        }

        const followers = await pool.query("SELECT * FROM users_follows WHERE follows = $1", [
            userId,
        ]);

        const follows = await pool.query("SELECT * FROM users_follows WHERE user_id = $1", [
            userId,
        ]);

        const posts = await pool.query("SELECT * FROM posts WHERE user_id = $1", [userId]);

        const postIds = posts.rows.map((post) => post.id);

        let likes = [];
        let comments = [];

        if (postIds.length > 0) {
            const likesResult = await pool.query(
                "SELECT * FROM users_likes WHERE post_id = ANY($1::int[])",
                [postIds]
            );
            const commentsResult = await pool.query(
                "SELECT * FROM users_comments WHERE post_id = ANY($1::int[])",
                [postIds]
            );

            likes = likesResult.rows;
            comments = commentsResult.rows;
        }

        const userIds = [...new Set(comments.map((comment) => comment.user_id))];
        const commentUsernamesMap = new Map<
            number,
            { username: string; profile_picture: string | null }
        >();

        if (userIds.length > 0) {
            const commentUsernamesResult = await pool.query(
                "SELECT id, username, profile_picture FROM users WHERE id = ANY($1::int[])",
                [userIds]
            );
            commentUsernamesResult.rows.forEach((row) => {
                commentUsernamesMap.set(row.id, {
                    username: row.username,
                    profile_picture: row.profile_picture,
                });
            });
        }

        const allPosts = posts.rows.map((post) => ({
            ...post,
            likes: likes.filter((like) => like.post_id === post.id).map((like) => like.user_id),
            comments: comments
                .filter((comment) => comment.post_id === post.id)
                .map((comment) => {
                    const userInfo = commentUsernamesMap.get(comment.user_id) || {
                        username: null,
                        profile_picture: null,
                    };
                    return {
                        id: comment.id,
                        user_id: comment.user_id,
                        username: userInfo.username,
                        profile_picture: userInfo.profile_picture ?? null,
                        comment: comment.comment,
                        created: comment.created,
                    };
                }),
        }));

        const data = {
            id: userInfo.rows[0].id,
            username: userInfo.rows[0].username,
            profile_picture: userInfo.rows[0].profile_picture,
            followers: followers.rows.map((follower) => follower.user_id),
            follows: follows.rows.map((follow) => follow.follows),
            posts: [...allPosts],
        };

        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const searchUsers = async (req: Request, res: Response) => {
    const query = req.query.query;

    if (!query) {
        res.sendStatus(400);
        return;
    }

    try {
        const result = await pool.query(
            "SELECT id, username, profile_picture FROM users WHERE username ILIKE $1",
            [`%${query}%`]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const followUser = async (req: Request, res: Response) => {
    const followerId = req.user?.id;
    const followingId = req.params.id;

    if (!followerId) {
        res.sendStatus(401);
        return;
    }

    if (Number(followerId) === Number(followingId)) {
        res.status(400).send("Kan inte följa dig själv");
        return;
    }

    try {
        await pool.query(
            "INSERT INTO users_follows (user_id, follows) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [followerId, followingId]
        );
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const unfollowUser = async (req: Request, res: Response) => {
    const followerId = req.user?.id;
    const followingId = req.params.id;

    if (!followerId) {
        res.sendStatus(401);
        return;
    }

    try {
        await pool.query("DELETE FROM users_follows WHERE user_id = $1 AND follows= $2", [
            followerId,
            followingId,
        ]);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const getFollowers = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        const followers = await pool.query(
            `SELECT users_follows.user_id, users.username, users.profile_picture
             FROM users_follows
             JOIN users ON users.id = users_follows.user_id
             WHERE users_follows.follows = $1`,
            [userId]
        );

        res.json(followers.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const getFollows = async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        const follows = await pool.query(
            `SELECT users_follows.follows AS user_id, users.username, users.profile_picture
             FROM users_follows
             JOIN users ON users.id = users_follows.follows
             WHERE users_follows.user_id = $1`,
            [userId]
        );
        res.json(follows.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        res.sendStatus(401);
        return;
    }

    try {
        await pool.query("DELETE FROM users WHERE id = $1", [userId]);

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "dev",
            sameSite: "strict",
        });

        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};
