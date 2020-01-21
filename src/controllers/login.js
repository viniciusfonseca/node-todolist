import { Router } from "express";
import { sign } from "../core/jwt";
import { Users } from "../models/Users";
import bcrypt from 'bcrypt'

export const loginRouter = Router()

loginRouter.post('/', async (req, res) => {
    const { email, password } = req.body
    const user = await Users.findOne({ where: { email } })
    if (!user) { res.status(401).send(); return }
    try { await bcrypt.compare(password, user.dataValues.password) }
    catch (e) { res.status(401).send(); return }
    const expiry = parseInt(new Date()) + 3 * 60 * 60 * 1000
    const token = sign({ expiry })
    res.status(200).send({ token })
})