import { TTile } from './tile'

export type TTheme = 'entur' | 'dark' | 'light'
export type TFooter = string

export type TSettings = {
    tiles: TTile[]
    version?: number
    theme?: TTheme
    footer?: TFooter
}
