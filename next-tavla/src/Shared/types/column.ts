export const Columns = {
    aimedTime: 'Planlagt',
    arrivalTime: 'Ankomst',
    transportMethod: 'Transportmiddel',
    line: 'Linje',
    destination: 'Destinasjon',
    platform: 'Plattform',
    time: 'Forventet',
    realtime: 'Sanntid',
    deviations: 'Avvik',
} as const

export type TColumn = keyof typeof Columns
