import { BoardIdDB } from 'types/db-types/boards'
import { UserIdDB } from 'types/db-types/users'

export type FolderDB = {
    id?: FolderIdDB
    name?: string
    owners?: UserIdDB[]
    boards?: BoardIdDB[]
    logo?: FolderLogoDB
}

export type FolderLogoDB = string
export type FolderIdDB = string
