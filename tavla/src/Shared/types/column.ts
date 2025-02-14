export const Columns = {
    aimedTime: 'Planlagt',
    arrivalTime: 'Ankomst',
    line: 'Linje',
    destination: 'Destinasjon og avvik',
    platform: 'Plattform',
    name: 'Stoppested',
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

export const DEFAULT_COMBINED_COLUMNS = [
    'line',
    'destination',
    'name',
    'platform',
    'time',
    'realtime',
] as TColumn[]
