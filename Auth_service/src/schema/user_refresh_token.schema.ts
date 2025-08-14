import { DataTypes, Deferrable, Sequelize } from "sequelize"
import { db } from "../config/connectDb"
import { user } from "./user.schema"
export const userRefreshTokens = db.define('user_refresh_tokens', {
    user_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
            model: user,
            key: 'id',
            deferrable: new Deferrable.INITIALLY_IMMEDIATE
        },
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: false,
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