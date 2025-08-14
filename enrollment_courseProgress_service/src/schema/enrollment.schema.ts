import { DataTypes, Sequelize } from "sequelize"
import { db } from "../config/index.config"

export const user_enrollments = db.define('user_enrollments', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()")
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    course_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()")
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()")
    }
})