import express from "express";
import client from "../postgres";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/follow/:id", auth, async (req, res) => {
    const followerId = req.user.id;
    const followingId = req.params.id;

    if (followerId === followingId) {
        res.status(400).send("Kan inte följa dig själv");
        return;
    }

    try {
        await client.query(
            "INSERT INTO users_follows (user_id, follows) VALUES ($1, $2) ON CONFLICT DO NOTHING",
            [followerId, followingId]
        );
        res.sendStatus(200);
        return;
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }
});

router.delete("/follow/:id", auth, async (req, res) => {
    const followerId = req.user.id;
    const followingId = req.params.id;

    try {
        await client.query("DELETE FROM users_follows WHERE user_id = $1 AND follows= $2", [
            followerId,
            followingId,
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
