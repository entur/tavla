export type TMeta = {
    title?: string
    created?: number
    lastActive?: number
    dateModified?: number
    version?: number
    fontSize?: TFontSize
    location?: TLocation
}

export type TFontSize = 'small' | 'medium' | 'large'
export type TCoordinate = { lat: number; lng: number }
export type TLocation = {
    name?: string
    coordinate?: TCoordinate
}
