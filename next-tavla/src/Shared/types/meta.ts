export type TMeta = {
    title?: string
    created?: number
    lastActive?: number
    dateModified?: number
    version?: number
    fontSize?: TFontSize
    showTitle?: boolean
    tags?: TTag[]
}

export type TTag = string
export type TFontSize = 'small' | 'medium' | 'large'
