import "dotenv/config"
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "../db/index"

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

export const db = drizzle(pool, { schema })

export const connectDB = async () => {
    try {
        await pool.query("SELECT 1")
        console.log("Connected With DB ✅")
    } catch (error) {
        console.log("Unable To Connect With DB ❌")
    }
}