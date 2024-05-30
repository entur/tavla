import { TFontSize } from './meta'
import { TColumn } from './column'
import { TMeta } from './meta'
import { TTile } from './tile'

export type TTheme = 'entur' | 'dark' | 'light'

export type TBoard = {
    id?: TBoardID
    meta: TMeta
    tiles: TTile[]
    theme?: TTheme
    footer?: TFooter
}

export type TBoardWithOrganization = {
    board: TBoard
    organization: TOrganization
}

export type TUser = {
    uid?: TUserID
    email?: string
    owner?: TBoardID[]
    editor?: TBoardID[]
}

export type TOrganization = {
    id?: TOrganizationID
    name?: string
    owners?: TUserID[]
    editors?: TUserID[]
    boards?: TBoardID[]
    logo?: TLogo
    defaults?: TDefaults
    footer?: string
}

export type TDefaults = {
    counties?: TCountyID[]
    font?: TFontSize
    columns?: TColumn[]
}

export type TInvite = {
    uid: TUserID
    type: 'board' | 'organization'
    access: 'owner' | 'editor'
}

export type TFooter = {
    override?: boolean
    footer?: string
}

export type TLogo = string
export type TUserID = string
export type TBoardID = string
export type TOrganizationID = string
export type TCountyID = string
