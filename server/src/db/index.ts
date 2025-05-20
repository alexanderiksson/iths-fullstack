import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.PGURI,
    ssl: {
        rejectUnauthorized: false,
    },
});

export default pool;
