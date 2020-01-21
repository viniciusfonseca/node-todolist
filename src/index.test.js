const axios = require('axios')
const api = axios.create({ baseURL: `http://localhost:3000` })
const TEST_LOGIN_EMAIL = "teste@example.com"
const TEST_LOGIN_PASSWORD = "veripag"
const app = require('./index')

beforeAll(() => app.done())

test('login', async () => {
    const { data } = await api.post('/login', {
        email: TEST_LOGIN_EMAIL,
        password: TEST_LOGIN_PASSWORD
    })
    const { token } = data
    expect(token).toBeTruthy()
})

describe('todos integration tests', () => {

    let user = axios.create({ baseURL: `http://localhost:3000` })

    beforeAll(async () => {
        const { data } = await api.post('/login', {
            email: TEST_LOGIN_EMAIL,
            password: TEST_LOGIN_PASSWORD
        })
        const { token } = data
        user.interceptors.request.use(config => {
            config.headers['Authorization'] = token
            return config
        })
    })

    it('retrieves the todos', async () => {
        const { data } = await user.get('/todos')
        expect(Array.isArray(data)).toBe(true)
    })

    it('creates a todo', async () => {
        const description = 'Description Test'
        const { data: todo } = await user.post('/todos', { description })
        expect(todo.description).toBe(description)
        expect(typeof todo.id).toBe("number")
        expect(todo.done).toBe(false)
        const { data: todos } = await user.get('/todos')
        expect(todos.find(({ id }) => id === todo.id)).toBeTruthy()
    })

    it('updates a todo', async () => {
        const description = 'Description Test 2'
        const { data: todo } = await user.post('/todos', { description })
        const updatedDescription = 'Description Test 2 Updated'
        const { data: updatedTodo } = await user.put(`/todos/${todo.id}`, {
            description: updatedDescription
        })
        expect(updatedTodo.description).toBe(updatedDescription)
    })

    it('deletes the todo', async () => {
        const description = 'Description Test 3'
        const { data: todo } = await user.post('/todos', { description })
        await user.delete(`/todos/${todo.id}`)
        const { data: todos } = await user.get('/todos')
        expect(todos.find(({ id }) => id === todo.id)).toBeFalsy()
    })
})

afterAll(async () => {
    await app.server.close()
    await app.db.close()
})