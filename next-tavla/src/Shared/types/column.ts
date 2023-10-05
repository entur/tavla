export const Columns = {
    destination: 'Destinasjon',
    line: 'Linje',
    time: 'Avgangstid',
    platform: 'Plattform',
    realtime: 'Sanntid',
} as const

export type TColumn = keyof typeof Columns
