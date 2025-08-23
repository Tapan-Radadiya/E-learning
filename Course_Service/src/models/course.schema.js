"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courses = void 0;
var sequelize_1 = require("sequelize");
var connectDb_1 = require("../config/connectDb");
exports.courses = connectDb_1.db.define('courses', {
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.Sequelize.literal('gen_random_uuid()')
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    thumbnail_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.Sequelize.literal("NOW()")
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.Sequelize.literal("NOW()")
    }
});
