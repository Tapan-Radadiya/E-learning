"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.course_modules = void 0;
var sequelize_1 = require("sequelize");
var connectDb_1 = require("../config/connectDb");
var course_schema_1 = require("./course.schema");
exports.course_modules = connectDb_1.db.define('course_modules', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.Sequelize.literal('gen_random_uuid()'),
    },
    course_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: course_schema_1.courses,
            key: 'id',
            deferrable: new sequelize_1.Deferrable.INITIALLY_IMMEDIATE
        },
    },
    video_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    completion_percentage: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    is_module_live: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    }
});
