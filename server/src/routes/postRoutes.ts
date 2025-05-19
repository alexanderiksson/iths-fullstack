import express from "express";
import client from "../postgres";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/posts/:user", async (req, res) => {
    const user = req.params.user;

    if (!user) {
        res.status(400).send("User id missing in params");
        return;
    }

    try {
        const posts = await client.query("SELECT * FROM posts WHERE user_id = $1", [user]);

        if (posts.rows.length === 0) {
            res.status(200).send("User has no posts");
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
