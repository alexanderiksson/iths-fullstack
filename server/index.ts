import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client } from "pg";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
dotenv.config();

const client = new Client({
    connectionString: process.env.PGURI,
});

client.connect();

app.get("/", async (req, res) => {
    const { rows } = await client.query("SELECT * FROM users");

    res.send(rows);
});

app.listen(port, () => {
    console.log("Server running on port: " + port);
});
