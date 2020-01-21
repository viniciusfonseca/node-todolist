const express = require('express')
const jwt = require('jsonwebtoken')
const { Sequelize, DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')
const cors = require('cors')
const morgan = require('morgan')
const EventEmitter = require('events')

const SALT_ROUNDS = 10
const JWT_SECRET = Math.random().toString(36)
const TEST_LOGIN_EMAIL = "teste@example.com"
const TEST_LOGIN_PASSWORD = "veripag"
const PORT = 3000

const db = new Sequelize({ dialect: 'sqlite', logging: false })
const Todos = db.define('todo', {
    description: { type: DataTypes.TEXT },
    done: { type: DataTypes.BOOLEAN, defaultValue: false }
})
const Users = db.define('user', {
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING }
})

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers['authorization']
        jwt.verify(token, JWT_SECRET)
        next()
    }
    catch (e) { res.status(401).send() }
}

const todosRouter = express.Router()

todosRouter.use(authMiddleware)

todosRouter.get('/', async (req, res) => {
    const todos = await Todos.findAll({})
    res.status(200).send(todos)
})

todosRouter.post('/', async (req, res) => {
    const { description } = req.body
    const todo = await Todos.create({ description })
    res.status(201).send(todo)
})

todosRouter.put('/:id', async (req, res) => {
    const todo = await Todos.findByPk(req.params.id)
    if (!todo) { res.status(404).send(); return }
    const { description, done } = req.body
    await todo.update({ description, done })
    res.status(200).send(todo)
})

todosRouter.delete('/:id', async (req, res) => {
    const todo = await Todos.findByPk(req.params.id)
    if (!todo) { res.status(404).send(); return }
    await todo.destroy()
    res.status(200).send()
})

app.use('/todos', todosRouter)

app.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await Users.findOne({ where: { email } })
    if (!user) { res.status(401).send(); return }
    try { await bcrypt.compare(password, user.dataValues.password) }
    catch (e) { res.status(401).send(); return }
    const token = jwt.sign("LOGIN_TOKEN", JWT_SECRET)
    res.status(200).send({ token })
})

const appEventEmitter = new EventEmitter()

db.sync().then(() =>
    bcrypt.genSalt(SALT_ROUNDS)
).then(salt =>
    bcrypt.hash(TEST_LOGIN_PASSWORD, salt)
).then(password =>
    Users.create({ email: TEST_LOGIN_EMAIL, password })    
).then(() =>
    app.listen(PORT, () => {
        console.log(`🚀 app listening at port ${PORT}`)
        appEventEmitter.emit('ready')
    })
)

app.db = db
app.done = () => new Promise(resolve => appEventEmitter.once('ready', resolve))

module.exports = app