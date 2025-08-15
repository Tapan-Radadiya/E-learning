import { DataTypes, Deferrable, Sequelize } from "sequelize"
import { db } from "../config/connectDb"
import { courses } from "./course.schema"

export const course_modules = db.define('course_modules', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
    },
    course_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: courses,
            key: 'id',
            deferrable: new Deferrable.INITIALLY_IMMEDIATE
        },
    },
    video_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completion_percentage: {
        type: DataTypes.INTEGER,
        allowNull: false
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