import { TMeta } from './meta'
import { TTile } from './tile'

export type TTheme = 'entur' | 'dark' | 'light'

export type TCombinedTiles = { ids: TBoardID[] }
export type TBoard = {
    id?: TBoardID
    meta: TMeta
    tiles: TTile[]
    combinedTiles?: TCombinedTiles[]
    theme?: TTheme
    footer?: TFooter
}
export type TBoardWithOrganizaion = {
    board: TBoard
    organization?: TOrganization
}

export type TUser = {
    uid?: TUserID
    email?: string
    owner?: TBoardID[]
}

export type TOrganization = {
    id?: TOrganizationID
    name?: string
    owners?: TUserID[]
    boards?: TBoardID[]
    logo?: TLogo
    footer?: string
}

export type TInvite = {
    uid: TUserID
    type: 'board' | 'organization'
    access: 'owner'
}

export type TFooter = {
    override?: boolean
    footer?: string
}

export type TLogo = string
export type TUserID = string
export type TBoardID = string
export type TOrganizationID = string
