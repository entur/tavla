import { BoardId } from 'types/db-types/boards'

export type UserDB = {
    uid?: UserId
    owner?: BoardId[]
}

export type UserId = string
