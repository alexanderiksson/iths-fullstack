import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import devRoutes from "./routes/devRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();
const port = 3000;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use("/dev", devRoutes);

// Frontend
app.use(express.static(path.join(__dirname, "../../client/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist", "index.html"));
});

// Start server
app.listen(port, () => {
    console.log("Server running on port: " + port);
});
