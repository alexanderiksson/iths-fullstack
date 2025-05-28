import { Request, Response } from "express";
import pool from "../db";

export const getFeed = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        res.sendStatus(401);
        return;
    }

    try {
        const followsResult = await pool.query(
            "SELECT follows FROM users_follows WHERE user_id = $1",
            [userId]
        );

        const followsIds = followsResult.rows.map((row) => row.follows);

        if (followsIds.length === 0) {
            res.json([]);
            return;
        }

        const posts = await pool.query(
            `SELECT posts.*, users.username
             FROM posts
             JOIN users ON posts.user_id = users.id
             WHERE posts.user_id = ANY($1::int[])`,
            [followsIds]
        );

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
        const commentUsernamesMap = new Map<number, string>();

        if (userIds.length > 0) {
            const commentUsernamesResult = await pool.query(
                "SELECT id, username FROM users WHERE id = ANY($1::int[])",
                [userIds]
            );
            commentUsernamesResult.rows.forEach((row) => {
                commentUsernamesMap.set(row.id, row.username);
            });
        }

        const allPosts = posts.rows.map((post) => ({
            ...post,
            likes: likes.filter((like) => like.post_id === post.id).map((like) => like.user_id),
            comments: comments
                .filter((comment) => comment.post_id === post.id)
                .map((comment) => ({
                    user_id: comment.user_id,
                    username: commentUsernamesMap.get(comment.user_id) || null,
                    comment: comment.comment,
                    created: comment.created,
                })),
        }));

        res.json(allPosts);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const createPost = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { text } = req.body;

    if (!userId) {
        res.sendStatus(401);
        return;
    }

    if (!text) {
        res.sendStatus(400);
        return;
    }

    try {
        await pool.query("INSERT INTO posts (text, user_id) VALUES ($1, $2)", [text, userId]);
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const deletePost = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const postId = req.params.id;

    if (!userId) {
        res.sendStatus(401);
        return;
    }

    try {
        await pool.query("DELETE FROM posts WHERE id = $1 AND user_id = $2", [postId, userId]);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const likePost = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const postId = req.params.id;

    if (!userId) {
        res.sendStatus(401);
        return;
    }

    try {
        await pool.query(
            "INSERT INTO users_likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [userId, postId]
        );
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const unlikePost = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const postId = req.params.id;

    if (!userId) {
        res.sendStatus(401);
        return;
    }

    try {
        await pool.query("DELETE FROM users_likes WHERE user_id = $1 AND post_id = $2", [
            userId,
            postId,
        ]);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const comment = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const postId = req.params.id;
    const { comment } = req.body;

    if (!userId) {
        res.sendStatus(401);
        return;
    }

    if (!comment) {
        res.sendStatus(400);
        return;
    }

    try {
        await pool.query(
            "INSERT INTO users_comments (user_id, post_id, comment) VALUES ($1, $2, $3)",
            [userId, postId, comment]
        );
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const commentId = req.params.id;

    if (!userId) {
        res.sendStatus(401);
        return;
    }

    try {
        await pool.query("DELETE FROM users_comments WHERE id = $1 AND user_id = $2", [
            commentId,
            userId,
        ]);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};
