import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Frontend
app.use(express.static(path.join(__dirname, "../../client/dist")));

app.get(/^\/(?!api).*/, (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../client/dist", "index.html"));
});

// Start server
app.listen(port, () => {
    console.log("Server running on port: " + port);
});
