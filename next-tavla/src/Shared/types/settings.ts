import { TTile } from './tile'

export type TTheme = 'entur' | 'dark' | 'light'

export type TSettings = {
    title?: string
    tiles: TTile[]
    version?: number
    theme?: TTheme
    tags?: string[]
}
