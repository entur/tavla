export const Columns = {
    aimedTime: 'Planlagt',
    arrivalTime: 'Ankomst',
    line: 'Linje',
    destination: 'Destinasjon og avvik',
    platform: 'Plattform',
    name: 'Stoppested',
    time: 'Forventet',
} as const

export type TColumn = keyof typeof Columns

export const DEFAULT_COLUMNS = ['line', 'destination', 'time'] as TColumn[]

export const DEFAULT_COMBINED_COLUMNS = [
    'line',
    'destination',
    'name',
    'platform',
    'time',
] as TColumn[]
