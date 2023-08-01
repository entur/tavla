export const Columns = {
    destination: 'Destinasjon',
    line: 'Linje',
    time: 'Avgangstid',
    platform: 'Plattform',
    via: 'Via',
} as const

export type TColumn = keyof typeof Columns
