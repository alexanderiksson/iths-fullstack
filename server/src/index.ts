import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import followRoutes from "./routes/followRoutes";
import pool from "./db";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
const port = 3000;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", userRoutes);
app.use("/api", postRoutes);
app.use("/api", followRoutes);

// Frontend
app.use(express.static(path.join(__dirname, "..", "public")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.get("/api", async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM users_follows");

    res.send(rows);
});

// Start server
app.listen(port, () => {
    console.log("Server running on port: " + port);
});
