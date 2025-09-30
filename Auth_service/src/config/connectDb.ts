import { Sequelize } from "sequelize";
import { drizzle } from "drizzle-orm/node-postgres"
import "dotenv/config"

export const connectDb = async () => {
    const db = drizzle({
        connection: {
            connectionString: process.env.DATABASE_URL,
        }
    })
}

