export const Columns = {
    aimedTime: 'Planlagt',
    arrivalTime: 'Ankomst',
    line: 'Linje',
    destination: 'Destinasjon og avvik',
    platform: 'Plattform',
    time: 'Forventet',
    realtime: 'Sanntidsindikator',
} as const

export type TColumn = keyof typeof Columns

export const DEFAULT_ORGANIZATION_COLUMNS = [
    'line',
    'destination',
    'time',
    'realtime',
] as TColumn[]
