import express from 'express'
import { todosRouter } from './controllers/todos'
import { db } from './core/db'
import { init } from './core/init'
import cors from 'cors'
import morgan from 'morgan'
import { loginRouter } from './controllers/login'

export const app = express()

if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'))
}
app.use(cors())
app.use(express.json())

app.use('/login', loginRouter)
app.use('/todos', todosRouter)

app.db = db
app.init = init