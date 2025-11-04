import { BoardDB } from 'types/db-types/boards'

export type UserDB = {
    uid?: UserId
    owner?: BoardDB['id'][]
}

export type UserId = string
