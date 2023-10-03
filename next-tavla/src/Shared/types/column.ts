export const Columns = {
    destination: 'Destinasjon',
    line: 'Linje',
    time: 'Avgangstid',
    platform: 'Plattform',
} as const

export type TColumn = keyof typeof Columns
