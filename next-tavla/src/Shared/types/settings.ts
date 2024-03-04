import { TFontSize } from './meta'
import { TColumn } from './column'
import { TFontSize } from './meta'
import { TMeta } from './meta'
import { TTile } from './tile'

export type TTheme = 'entur' | 'dark' | 'light'

export type TBoard = {
    id?: TBoardID
    meta: TMeta
    tiles: TTile[]
    theme?: TTheme
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
}

export type TDefaults = {
    counties?: TCountyID[]
    font?: TFontSize
    columns?: TColumn[]
    font?: TFontSize
    columns?: TColumn[]
}

export type TInvite = {
    uid: TUserID
    type: 'board' | 'organization'
    access: 'owner' | 'editor'
}

export type TLogo = string
export type TUserID = string
export type TBoardID = string
export type TOrganizationID = string
export type TCountyID = string
