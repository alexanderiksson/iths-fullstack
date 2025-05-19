import express from "express";
import client from "../postgres";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/posts/:user", async (req, res) => {
    const user = req.params.user;

    try {
        const posts = await client.query("SELECT * FROM posts WHERE user_id = $1", [user]);

        if (posts.rows.length === 0) {
            res.status(200).json({ message: "User has no posts" });
            return;
        }

        res.status(200).json(posts.rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }
});

export default router;
