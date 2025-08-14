import { Sequelize } from "sequelize";
import "dotenv/config"

export const db = new Sequelize(process.env.POSTGRESS_CONN_URL!, {
    dialect: 'postgres',
    logging: false
})

export const connectDB = async () => {
    try {
        await db.authenticate()
        console.log("CourseService/ Connection With Pgsql Has Been Established 🚀")
    } catch (error) {
        console.log('error->', error)
    }
}