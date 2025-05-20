import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import followRoutes from "./routes/followRoutes";
import client from "./postgres";
import cookieParser from "cookie-parser";
import auth from "./middlewares/auth";

const app = express();
const port = 3000;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/", userRoutes);
app.use("/", postRoutes);
app.use("/", followRoutes);

app.get("/", async (req, res) => {
    const { rows } = await client.query("SELECT * FROM users_follows");

    res.send(rows);
});

app.get("/feed", auth, async (req, res) => {
    try {
        const userId = req.user.id; // Antar att din auth-middleware lägger in user i req

        // Hämta alla user_ids som den inloggade följer
        const followsResult = await client.query(
            "SELECT follows FROM users_follows WHERE user_id = $1",
            [userId]
        );

        const followsIds = followsResult.rows.map((row) => row.follows);

        if (followsIds.length === 0) {
            // Om användaren inte följer någon, returnera tom array
            res.json([]);
            return;
        }

        // Hämta alla inlägg från användare som följs, sorterade nyast först
        const postsResult = await client.query(
            `SELECT posts.*, users.username
             FROM posts
             JOIN users ON posts.user_id = users.id
             WHERE posts.user_id = ANY($1)
             ORDER BY posts.created DESC`,
            [followsIds]
        );

        res.json(postsResult.rows);
        return;
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
        return;
    }
});

// Start server
app.listen(port, () => {
    console.log("Server running on port: " + port);
});
