export type TMeta = {
    title?: string
    created?: number
    lastActive?: number
    dateModified?: number
    version?: number
    fontSize?: TFontSize
}

export type TFontSize = 'small' | 'medium' | 'large'
