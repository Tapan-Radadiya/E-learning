import { Sequelize } from "sequelize";
import "dotenv/config"

export const db = new Sequelize(process.env.POSTGRESS_CONN_URL!, {
    dialect: 'postgres',
    logging: false
})

export const connectDb = async () => {
    try {
        await db.authenticate()
        console.log("AuthServices/ Connection With Pgsql Has Been Established 🚀")
    } catch (error) {
        console.log(`Error Connecting With DB ${error}`);
    }
}