import { DataTypes, Sequelize } from "sequelize"
import { db } from "../config/connectDb"

export const user = db.define('user', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
    },
    display_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_role: {
        type: DataTypes.ENUM('ADMIN', 'USER'),
        allowNull: false,
        defaultValue: 'USER'
    },
    createdAt: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.TIME,
        allowNull: false,
    }
})