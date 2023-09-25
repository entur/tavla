export type TTag = string

export type TMeta = {
    title?: string
    created?: number
    lastActive?: number
    dateModified?: number
    version?: number
    fontSize?: TFontSize
    tags?: TTag[]
}

export type TFontSize = 'small' | 'medium' | 'large'
