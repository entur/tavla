import type { TTransportMode } from 'src/types/graphql-schema'
import type {
    BoardTileDB,
    QuaysFilterDB,
    StopPlaceFilterDB,
} from 'types/db-types/boards'
import { describe, expect, it } from 'vitest'
import type { LineWithFrontText, QuayWithFrontText } from '../utils/types'
import {
    compressQuaysFilter,
    compressStopPlaceFilter,
    expandQuaysFilter,
    expandStopPlaceFilter,
    getInitialQuaysFilter,
    getInitialStopPlaceFilter,
    groupLinesByTransportMode,
    sortLineFragment,
    type TransportModeGroup,
} from './utils'

// transportMode er valgfri, kun grupperingstestene bruker den
function quay(
    id: string,
    lines: Array<{
        id: string
        frontTexts: string[]
        transportMode?: TTransportMode
    }>,
): QuayWithFrontText {
    return { id, lines } as unknown as QuayWithFrontText
}

// Frittstående linje, til tester uten quay (sortLineFragment, expandStopPlaceFilter)
function line(
    id: string,
    opts: {
        transportMode?: TTransportMode | null
        publicCode?: string | null
        frontTexts?: string[]
    } = {},
): LineWithFrontText {
    return {
        id,
        transportMode: opts.transportMode ?? null,
        publicCode: opts.publicCode ?? null,
        frontTexts: opts.frontTexts ?? [],
    } as unknown as LineWithFrontText
}

describe('sortLineFragment', () => {
    it('sorterer alfabetisk på transportMode', () => {
        const bus = line('L1', { transportMode: 'bus', publicCode: '1' })
        const tram = line('L2', { transportMode: 'tram', publicCode: '1' })
        expect(sortLineFragment(bus, tram)).toBeLessThan(0)
    })

    it('sorterer publicCode numerisk, ikke alfabetisk (2 før 10)', () => {
        const ten = line('L1', { transportMode: 'bus', publicCode: '10' })
        const two = line('L2', { transportMode: 'bus', publicCode: '2' })
        expect(sortLineFragment(ten, two)).toBeGreaterThan(0)
    })

    it('feiler ikke når transportMode eller publicCode mangler', () => {
        const withoutFields = line('L1')
        const bus = line('L2', { transportMode: 'bus', publicCode: '1' })
        expect(() => sortLineFragment(withoutFields, bus)).not.toThrow()
        expect(sortLineFragment(withoutFields, bus)).toBeLessThan(0)
    })
})

describe('expandQuaysFilter', () => {
    it('tom selectedLines på en lagret quay betyr alle linjer på den quayen', () => {
        const filter: QuaysFilterDB = {
            type: 'quaysFilter',
            quays: [{ id: 'Q1', selectedLines: [] }],
        }
        const quays = [
            quay('Q1', [
                { id: 'L1', frontTexts: [] },
                { id: 'L2', frontTexts: [] },
            ]),
        ]
        expect(expandQuaysFilter(filter, quays)).toEqual({
            type: 'quaysFilter',
            quays: [{ id: 'Q1', selectedLines: ['L1', 'L2'] }],
        })
    })

    it('beholder eksplisitt valgte linjer uendret', () => {
        const filter: QuaysFilterDB = {
            type: 'quaysFilter',
            quays: [{ id: 'Q1', selectedLines: ['L1'] }],
        }
        const quays = [
            quay('Q1', [
                { id: 'L1', frontTexts: [] },
                { id: 'L2', frontTexts: [] },
            ]),
        ]
        expect(expandQuaysFilter(filter, quays)).toEqual({
            type: 'quaysFilter',
            quays: [{ id: 'Q1', selectedLines: ['L1'] }],
        })
    })

    it('en quay som manglet i filteret i et tomt filter velges', () => {
        const filter: QuaysFilterDB = { type: 'quaysFilter', quays: [] }
        const quays = [quay('Q1', [{ id: 'L1', frontTexts: [] }])]
        expect(expandQuaysFilter(filter, quays)).toEqual({
            type: 'quaysFilter',
            quays: [{ id: 'Q1', selectedLines: ['L1'] }],
        })
    })

    it('en quay som mangler i filteret får ingen linjer hvis andre quays allerede er filtrert på', () => {
        const filter: QuaysFilterDB = {
            type: 'quaysFilter',
            quays: [{ id: 'Q2', selectedLines: ['L2'] }],
        }
        const quays = [
            quay('Q1', [{ id: 'L1', frontTexts: [] }]),
            quay('Q2', [{ id: 'L2', frontTexts: [] }]),
        ]
        expect(expandQuaysFilter(filter, quays)).toEqual({
            type: 'quaysFilter',
            quays: [
                { id: 'Q1', selectedLines: [] },
                { id: 'Q2', selectedLines: ['L2'] },
            ],
        })
    })
})

describe('getInitialQuaysFilter', () => {
    it('bruker tile.filter når det allerede er en quaysFilter', () => {
        const tile = {
            filter: {
                type: 'quaysFilter',
                quays: [{ id: 'Q1', selectedLines: ['L1'] }],
            },
        } as unknown as BoardTileDB
        const quays = [
            quay('Q1', [
                { id: 'L1', frontTexts: [] },
                { id: 'L2', frontTexts: [] },
            ]),
        ]
        expect(getInitialQuaysFilter(tile, quays)).toEqual({
            type: 'quaysFilter',
            quays: [{ id: 'Q1', selectedLines: ['L1'] }],
        })
    })

    it('faller tilbake til tomt filter når tile.filter mangler', () => {
        const tile = {} as unknown as BoardTileDB
        const quays = [quay('Q1', [{ id: 'L1', frontTexts: [] }])]
        expect(getInitialQuaysFilter(tile, quays)).toEqual({
            type: 'quaysFilter',
            quays: [{ id: 'Q1', selectedLines: ['L1'] }],
        })
    })
})

describe('compressQuaysFilter', () => {
    it('en quay uten valgte linjer lagres ikke', () => {
        const quays = [quay('Q1', [{ id: 'L1', frontTexts: [] }])]
        const filter: QuaysFilterDB = {
            type: 'quaysFilter',
            quays: [{ id: 'Q1', selectedLines: [] }],
        }
        expect(compressQuaysFilter(filter, quays)).toEqual({
            type: 'quaysFilter',
            quays: [],
        })
    })

    it('en quay med alle linjer valgt komprimeres til tom selectedLines-liste', () => {
        const quays = [
            quay('Q1', [
                { id: 'L1', frontTexts: [] },
                { id: 'L2', frontTexts: [] },
            ]),
            quay('Q2', [{ id: 'L3', frontTexts: [] }]),
        ]
        const filter: QuaysFilterDB = {
            type: 'quaysFilter',
            quays: [
                { id: 'Q1', selectedLines: ['L1', 'L2'] },
                { id: 'Q2', selectedLines: [] },
            ],
        }
        expect(compressQuaysFilter(filter, quays)).toEqual({
            type: 'quaysFilter',
            quays: [{ id: 'Q1', selectedLines: [] }],
        })
    })

    it('en delvis valgt quay beholdes med eksplisitt satt liste med linjer', () => {
        const quays = [
            quay('Q1', [
                { id: 'L1', frontTexts: [] },
                { id: 'L2', frontTexts: [] },
            ]),
        ]
        const filter: QuaysFilterDB = {
            type: 'quaysFilter',
            quays: [{ id: 'Q1', selectedLines: ['L1'] }],
        }
        expect(compressQuaysFilter(filter, quays)).toEqual({
            type: 'quaysFilter',
            quays: [{ id: 'Q1', selectedLines: ['L1'] }],
        })
    })

    it('komprimerer et filter der alt er valgt til en tom liste', () => {
        const quays = [
            quay('Q1', [{ id: 'L1', frontTexts: [] }]),
            quay('Q2', [{ id: 'L2', frontTexts: [] }]),
        ]
        const filter: QuaysFilterDB = {
            type: 'quaysFilter',
            quays: [
                { id: 'Q1', selectedLines: ['L1'] },
                { id: 'Q2', selectedLines: ['L2'] },
            ],
        }
        expect(compressQuaysFilter(filter, quays)).toEqual({
            type: 'quaysFilter',
            quays: [],
        })
    })
})

describe('groupLinesByTransportMode', () => {
    it('grupperer linjer fra flere plattformer etter transportmiddel', () => {
        const quays = [
            quay('Q1', [{ id: 'L1', frontTexts: [], transportMode: 'bus' }]),
            quay('Q2', [{ id: 'L2', frontTexts: [], transportMode: 'tram' }]),
        ]
        const groups = groupLinesByTransportMode(quays)
        expect(groups.map((g) => g.mode).sort()).toEqual(['bus', 'tram'])
        expect(
            groups.find((g) => g.mode === 'bus')?.lines.map((l) => l.id),
        ).toEqual(['L1'])
    })

    it('en linje på flere plattformer vises kun én gang, med frontTexts slått sammen', () => {
        const quays = [
            quay('Q1', [
                { id: 'L1', frontTexts: ['Mot sentrum'], transportMode: 'bus' },
            ]),
            quay('Q2', [
                {
                    id: 'L1',
                    frontTexts: ['Mot Majorstua'],
                    transportMode: 'bus',
                },
            ]),
        ]
        const groups = groupLinesByTransportMode(quays)
        const busGroup = groups.find((g) => g.mode === 'bus')
        expect(busGroup?.lines).toHaveLength(1)
        expect(new Set(busGroup?.lines[0]?.frontTexts)).toEqual(
            new Set(['Mot sentrum', 'Mot Majorstua']),
        )
    })

    it('linjer uten transportMode havner i «unknown»-gruppen', () => {
        const quays = [quay('Q1', [{ id: 'L1', frontTexts: [] }])]
        const groups = groupLinesByTransportMode(quays)
        expect(groups.map((g) => g.mode)).toEqual(['unknown'])
    })
})

describe('expandStopPlaceFilter', () => {
    const groups: TransportModeGroup[] = [
        { mode: 'bus', lines: [line('L1'), line('L2')] },
        { mode: 'tram', lines: [line('L3')] },
    ]

    it('uten noen filtrering velges alle linjer i alle grupper', () => {
        const filter: StopPlaceFilterDB = {
            type: 'stopPlaceFilter',
            selectedTransportModes: [],
            selectedLines: [],
        }
        expect(expandStopPlaceFilter(filter, groups)).toEqual({
            type: 'stopPlaceFilter',
            selectedTransportModes: [],
            selectedLines: ['L1', 'L2', 'L3'],
        })
    })

    it('selectedTransportModes utvides til enkeltlinjer og slås sammen med eksplisitt valgte linjer', () => {
        const filter: StopPlaceFilterDB = {
            type: 'stopPlaceFilter',
            selectedTransportModes: ['bus'],
            selectedLines: ['L3'],
        }
        const result = expandStopPlaceFilter(filter, groups)
        expect(result.selectedTransportModes).toEqual([])
        expect(new Set(result.selectedLines)).toEqual(
            new Set(['L1', 'L2', 'L3']),
        )
    })
})

describe('getInitialStopPlaceFilter', () => {
    it('bruker tile.filter når det allerede er en stopPlaceFilter, og fyller inn linjer for valgte moduser', () => {
        const tile = {
            filter: {
                type: 'stopPlaceFilter',
                selectedTransportModes: ['bus'],
                selectedLines: [],
            },
        } as unknown as BoardTileDB
        const quays = [
            quay('Q1', [
                { id: 'L1', frontTexts: [], transportMode: 'bus' },
                { id: 'L2', frontTexts: [], transportMode: 'tram' },
            ]),
        ]
        expect(getInitialStopPlaceFilter(tile, quays)).toEqual({
            type: 'stopPlaceFilter',
            selectedTransportModes: [],
            selectedLines: ['L1'],
        })
    })

    it('uten noe stopPlaceFilter satt velges alle linjer på stoppestedet', () => {
        const tile = {} as unknown as BoardTileDB
        const quays = [
            quay('Q1', [{ id: 'L1', frontTexts: [], transportMode: 'bus' }]),
        ]
        expect(getInitialStopPlaceFilter(tile, quays)).toEqual({
            type: 'stopPlaceFilter',
            selectedTransportModes: [],
            selectedLines: ['L1'],
        })
    })
})

describe('compressStopPlaceFilter', () => {
    const quays = [
        quay('Q1', [
            { id: 'L1', frontTexts: [], transportMode: 'bus' },
            { id: 'L2', frontTexts: [], transportMode: 'bus' },
            { id: 'L3', frontTexts: [], transportMode: 'tram' },
        ]),
    ]

    it('komprimerer alle linjer valgt til tomme lister', () => {
        const filter: StopPlaceFilterDB = {
            type: 'stopPlaceFilter',
            selectedTransportModes: [],
            selectedLines: ['L1', 'L2', 'L3'],
        }
        expect(compressStopPlaceFilter(filter, quays)).toEqual({
            type: 'stopPlaceFilter',
            selectedTransportModes: [],
            selectedLines: [],
        })
    })

    it('alle linjer i én gruppe valgt komprimeres til selectedTransportModes', () => {
        const filter: StopPlaceFilterDB = {
            type: 'stopPlaceFilter',
            selectedTransportModes: [],
            selectedLines: ['L1', 'L2'],
        }
        expect(compressStopPlaceFilter(filter, quays)).toEqual({
            type: 'stopPlaceFilter',
            selectedTransportModes: ['bus'],
            selectedLines: [],
        })
    })

    it('spesifikke linjer som er valgt beholdes eksplisitt som linjer, når ikke alle linjer i transportmodus er valgt', () => {
        const filter: StopPlaceFilterDB = {
            type: 'stopPlaceFilter',
            selectedTransportModes: [],
            selectedLines: ['L1'],
        }
        expect(compressStopPlaceFilter(filter, quays)).toEqual({
            type: 'stopPlaceFilter',
            selectedTransportModes: [],
            selectedLines: ['L1'],
        })
    })
})
