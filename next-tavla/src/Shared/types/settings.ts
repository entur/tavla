import { TTile } from './tile'

export type TTheme = 'entur' | 'dark' | 'light'

export type TBoard = {
    id?: TBoardID
    title?: string
    tiles: TTile[]
    version?: number
    theme?: TTheme
}

export type TUser = {
    owner?: TBoardID[]
    editor?: TBoardID[]
    viewer?: TBoardID[]
}

export type TOrganization = {
    owners?: TUserID[]
    editors?: TUserID[]
    viewers?: TUserID[]
    boards?: TBoardID[]
}

export type TUserID = string
export type TBoardID = string
