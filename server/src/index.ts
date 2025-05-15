import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import client from "./postgres";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/", userRoutes);

app.get("/", async (req, res) => {
    const { rows } = await client.query("SELECT * FROM users");

    res.send(rows);
});

app.listen(port, () => {
    console.log("Server running on port: " + port);
});
