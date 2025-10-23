import { BoardIdDB } from 'types/db-types/boards'

export type TUser = {
    uid?: UserIdDB
    owner?: BoardIdDB[]
}

export type UserIdDB = string
