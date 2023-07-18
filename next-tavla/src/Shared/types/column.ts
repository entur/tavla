export const Columns = {
    destination: 'Destinasjon',
    line: 'Linje',
    platform: 'Plattform',
    time: 'Avgang',
    situations: 'Avvik',
    via: 'Via',
} as const

export type TColumn = keyof typeof Columns
export type TColumnSettings = Partial<Record<TColumn, boolean>>

export const DefaultColumns: TColumnSettings = {
    line: true,
    destination: true,
    platform: false,
    situations: true,
    time: true,
    via: false,
} as const

export type TColumnLayout = {
    type: TColumn
    size: number
}
