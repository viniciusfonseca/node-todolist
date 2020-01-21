import { db } from "../core/db";
import { DataTypes } from "sequelize";

export const Todos = db.define('todo', {
    description: { type: DataTypes.TEXT },
    done: { type: DataTypes.BOOLEAN, defaultValue: false }
})