import { Request, Response } from "express";
import pool from "../db";

export const getFeed = async (req: Request, res: Response) => {
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

        const allPosts = posts.rows.map((post) => ({
            ...post,
            likes: likes.filter((like) => like.post_id === post.id).map((like) => like.user_id),
            comments: comments
                .filter((comment) => comment.post_id === post.id)
                .map((comment) => ({
                    user_id: comment.user_id,
                    comment: comment.comment,
                    created: comment.created,
                })),
        }));

        res.json(allPosts);
        return;
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }
};

export const createPost = async (req: Request, res: Response) => {
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
};

export const likePost = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const postId = req.params.id;

    try {
        await pool.query(
            "INSERT INTO users_likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [userId, postId]
        );
        res.sendStatus(200);
        return;
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }
};

export const unlikePost = async (req: Request, res: Response) => {
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
};

export const comment = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const postId = req.params.id;
    const { comment } = req.body;

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
        return;
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const commentId = req.params.id;

    try {
        await pool.query("DELETE FROM users_comments WHERE id = $1 AND user_id = $2", [
            commentId,
            userId,
        ]);
        res.sendStatus(200);
        return;
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }
};
