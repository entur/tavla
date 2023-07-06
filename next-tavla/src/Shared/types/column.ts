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

export const ColumnOrder: TColumnOrder = [
    { type: 'line', size: 1 },
    { type: 'destination', size: 2 },
    { type: 'via', size: 2 },
    { type: 'platform', size: 3 },
    { type: 'situations', size: 4 },
    { type: 'time', size: 1 },
]
