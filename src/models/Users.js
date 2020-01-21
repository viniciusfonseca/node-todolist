import { db } from "../core/db";
import { DataTypes } from "sequelize";

export const Users = db.define('user', {
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING }
})