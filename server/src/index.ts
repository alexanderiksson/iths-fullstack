import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import cookieParser from "cookie-parser";
import path from "path";
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
app.use(express.static(path.join(path.resolve(), "../public")));

// Start server
app.listen(port, () => {
    console.log("Server running on port: " + port);
});
