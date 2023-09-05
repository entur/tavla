import { dates } from './dates'
import { TTile } from './tile'

export type TTheme = 'entur' | 'dark' | 'light'

export type TBoard = {
    id?: TBoardID
    title?: string
    dates?: dates
    tiles: TTile[]
    version?: number
    theme?: TTheme
}

export type TUser = {
    owner?: TBoardID[]
    editor?: TBoardID[]
}

export type TOrganization = {
    owners?: TUserID[]
    editors?: TUserID[]
    boards?: TBoardID[]
}

export type TInvite = {
    uid: TUserID
    type: 'board' | 'organization'
    access: 'owner' | 'editor'
}

export type TUserID = string
export type TBoardID = string
