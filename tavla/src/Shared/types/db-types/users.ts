import { BoardIdDB } from 'types/db-types/boards'

export type UserDB = {
    uid?: UserIdDB
    owner?: BoardIdDB[]
}

export type UserIdDB = string
