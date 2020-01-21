import bcrypt from 'bcrypt'
import { db } from "./db"
import { Users } from '../models/Users'
import { setAssociations } from '../models/setAssociations'

const SALT_ROUNDS = 10
const TEST_LOGIN_EMAIL = "teste@example.com"
const TEST_LOGIN_PASSWORD = "veripag"
const PORT = 3000

export function init() {
    return new Promise(resolve =>
        db.sync().then(() => {
            setAssociations()
            return bcrypt.genSalt(SALT_ROUNDS)
        }
        ).then(salt =>
            bcrypt.hash(TEST_LOGIN_PASSWORD, salt)
        ).then(password =>
            Users.create({ email: TEST_LOGIN_EMAIL, password })    
        ).then(() =>
            this.server = this.listen(PORT, () => resolve(PORT))
        )
    )
}