import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth'
import { Todos } from '../models/Todos'

export const todosRouter = Router()

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