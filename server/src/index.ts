import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import client from "./postgres";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/", userRoutes);
app.use("/", postRoutes);

app.get("/", async (req, res) => {
    const { rows } = await client.query("SELECT * FROM posts");

    res.send(rows);
});

app.listen(port, () => {
    console.log("Server running on port: " + port);
});
