export const Columns = {
    destination: 'Destinasjon',
    line: 'Linje',
    platform: 'Plattform',
    time: 'Avgangstid',
    situations: 'Avvik',
    via: 'Via',
} as const

export type TColumn = keyof typeof Columns
export type TColumnSettings = Record<TColumn, boolean>

export const DefaultColumns: TColumnSettings = {
    line: true,
    destination: true,
    platform: false,
    situations: true,
    time: true,
    via: true,
} as const

export type TColumnOrder = { type: TColumn; size: number }[]
