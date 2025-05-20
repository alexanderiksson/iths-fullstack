import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
    connectionString: process.env.PGURI,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect();

export default client;
