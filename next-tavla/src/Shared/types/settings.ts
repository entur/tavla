import { TTile } from './tile'

export type TTheme = 'default' | 'dark' | 'light'

export type TSettings = {
    tiles: TTile[]
    version?: number
    theme?: TTheme
}
