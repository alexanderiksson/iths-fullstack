import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import followRoutes from "./routes/followRoutes";
import cookieParser from "cookie-parser";
import path from "path";
import devRoutes from "./routes/devRoutes";

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

app.use("/dev", devRoutes);

// Frontend
app.use(express.static(path.join(path.resolve(), "../public")));

// Start server
app.listen(port, () => {
    console.log("Server running on port: " + port);
});
