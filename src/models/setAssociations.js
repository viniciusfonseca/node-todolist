import { Users } from "./Users";
import { Todos } from "./Todos";

export function setAssociations() {

    Users.hasMany(Todos)
}