export const Columns = {
    aimedTime: 'Planlagt',
    line: 'Linje',
    destination: 'Destinasjon',
    platform: 'Plattform',
    expectedTime: 'Forventet',
    realtime: 'Sanntid',
} as const

export type TColumn = keyof typeof Columns
