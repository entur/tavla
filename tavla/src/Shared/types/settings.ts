import { TMeta } from './meta'
import { TTile } from './tile'

export type TTheme = 'entur' | 'dark' | 'light'

export type TTransportPalette = 'default' | 'blue-bus' | 'green-bus'

export type TCombinedTiles = { ids: TBoardID[] }

export type TBoard = {
    id?: TBoardID
    meta: TMeta
    tiles: TTile[]
    combinedTiles?: TCombinedTiles[]
    theme?: TTheme
    footer?: TFooter
    transportPalette?: TTransportPalette
}

export type TBoardWithFolder = {
    board: TBoard
    folder?: TFolder
}

export type TUser = {
    uid?: TUserID
    email?: string
    owner?: TBoardID[]
}

export type TFolder = {
    id?: TFolderID
    name?: string
    owners?: TUserID[]
    boards?: TBoardID[]
    logo?: TLogo
}

export type TInvite = {
    uid: TUserID
    type: 'board' | 'folder'
    access: 'owner'
}

export type TFooter = {
    footer?: string
}

export type TLogo = string
export type TUserID = string
export type TBoardID = string
export type TFolderID = string
