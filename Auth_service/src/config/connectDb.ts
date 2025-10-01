import { drizzle } from "drizzle-orm/node-postgres"
import "dotenv/config"
import { Pool } from "pg";
import * as schema from "../db/index"

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

export const db = drizzle(pool, { schema })

export const connectDb = async () => {
    try {
        await pool.query("SELECT 1")
        console.log("Postgres Db Connected Successfully ✅")
    } catch (error) {
        console.log("Unable To Connect To Postgres Db ❌")
    }
}
