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
    getInitialCheckedLineIds,
    getInitialFilterType,
    getInitialQuaysFilter,
    getInitialStopPlaceFilter,
    groupLinesByTransportMode,
    quaysToQuaysFilter,
    sortLineFragment,
    type TransportModeGroup,
} from './utils'

/* Minimal fixture — caster forbi feltene testene under ikke bryr seg om. transportMode er valgfri siden kun grupperingstestene trenger den.*/
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

/* Minimal fixture — getInitialCheckedLineIds bruker kun tile.quays (id + whitelistedLines) og tile.whitelistedLines, så vi caster forbi resten av BoardTileDB-feltene.*/
function adminTile(
    quays: Array<{ id: string; whitelistedLines: string[] }>,
    whitelistedLines?: string[],
): BoardTileDB {
    return {
        quays,
        whitelistedLines,
    } as unknown as BoardTileDB
}

/* Minimal fixture — en frittstående linje, til bruk i tester som ikke går via en quay (sortLineFragment, expandStopPlaceFilter).*/
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

/* getInitialCheckedLineIds(tile, quays): regner ut hvilke `${quayId}||${lineId}`-bokser som skal være forhåndsavhuket når en lagret tile åpnes.
 `quays` er linjene hentet fra API-et (fasit på hva som finnes nå);
 `tile` representerer det som er lagret i databasen*/
describe('getInitialCheckedLineIds (read-back-presedens)', () => {
    it('for quay lagret med en ikke-tom whitelistedLines returneres kun de linjene', () => {
        const tile = adminTile([{ id: 'Q1', whitelistedLines: ['L1'] }])
        const quays = [
            quay('Q1', [
                { id: 'L1', frontTexts: [] },
                { id: 'L2', frontTexts: [] },
            ]),
        ]
        expect(getInitialCheckedLineIds(tile, quays)).toEqual(
            new Set(['Q1||L1']),
        )
    })

    it('for quay lagret med tom whitelistedLines tolkes [] som "alle linjer på quayen" og alle linjer returneres', () => {
        const tile = adminTile([{ id: 'Q1', whitelistedLines: [] }])
        const quays = [
            quay('Q1', [
                { id: 'L1', frontTexts: [] },
                { id: 'L2', frontTexts: [] },
            ]),
        ]
        expect(getInitialCheckedLineIds(tile, quays)).toEqual(
            new Set(['Q1||L1', 'Q1||L2']),
        )
    })

    it('tile har en quay med whitelistedLines, på stoppet finnes det flere quays som ikke er lagret på tile. Da returneres kun kombinasjon av lagret quay og linje', () => {
        const tile = adminTile([{ id: 'Q1', whitelistedLines: ['L1'] }])
        const quays = [
            quay('Q1', [{ id: 'L1', frontTexts: [] }]),
            quay('Q2', [{ id: 'L3', frontTexts: [] }]),
        ]
        expect(getInitialCheckedLineIds(tile, quays)).toEqual(
            new Set(['Q1||L1']),
        )
    })

    it('når ingen quays lagret, men deprekert tile.whitelistedLines er satt så returneres alle kombinasjoner quay og valgt linje', () => {
        const tile = adminTile([], ['L1'])
        const quays = [
            quay('Q1', [
                { id: 'L1', frontTexts: [] },
                { id: 'L2', frontTexts: [] },
            ]),
            quay('Q2', [
                { id: 'L1', frontTexts: [] },
                { id: 'L3', frontTexts: [] },
            ]),
            quay('Q3', [
                { id: 'L2', frontTexts: [] },
                { id: 'L3', frontTexts: [] },
            ]),
        ]
        expect(getInitialCheckedLineIds(tile, quays)).toEqual(
            new Set(['Q1||L1', 'Q2||L1']),
        )
    })

    it('verken quays eller tile.whitelistedLines er satt så alle kombinasjoner returneres', () => {
        const tile = adminTile([])
        const quays = [
            quay('Q1', [
                { id: 'L1', frontTexts: [] },
                { id: 'L2', frontTexts: [] },
            ]),
        ]
        expect(getInitialCheckedLineIds(tile, quays)).toEqual(
            new Set(['Q1||L1', 'Q1||L2']),
        )
    })
})

describe('sortLineFragment (sortering av linjer innad i en gruppe)', () => {
    it('sorterer på transportMode alfabetisk når linjene har ulik transportmodus', () => {
        const bus = line('L1', { transportMode: 'bus', publicCode: '1' })
        const tram = line('L2', { transportMode: 'tram', publicCode: '1' })
        expect(sortLineFragment(bus, tram)).toBeLessThan(0)
    })

    it('sorterer numerisk på publicCode innad i samme transportmodus, slik at «2» kommer før «10»', () => {
        const ten = line('L1', { transportMode: 'bus', publicCode: '10' })
        const two = line('L2', { transportMode: 'bus', publicCode: '2' })
        expect(sortLineFragment(ten, two)).toBeGreaterThan(0)
    })

    it('håndterer manglende transportMode og publicCode uten å kaste feil', () => {
        const withoutFields = line('L1')
        const bus = line('L2', { transportMode: 'bus', publicCode: '1' })
        expect(() => sortLineFragment(withoutFields, bus)).not.toThrow()
        expect(sortLineFragment(withoutFields, bus)).toBeLessThan(0)
    })
})

describe('getInitialFilterType (hvilken filtertype som forhåndsvelges når modalen åpnes)', () => {
    it('bruker tile.filter.type når det allerede er lagret et filter', () => {
        const tile = {
            filter: {
                type: 'stopPlaceFilter',
                whitelistedModes: [],
                whitelistedLines: [],
            },
            quays: [{ id: 'Q1', whitelistedLines: ['L1'] }],
        } as unknown as BoardTileDB
        expect(getInitialFilterType(tile)).toBe('stopPlaceFilter')
    })

    it('faller tilbake til quaysFilter når filter mangler, men gammel tile.quays finnes (bakoverkompatibilitet)', () => {
        const tile = {
            quays: [{ id: 'Q1', whitelistedLines: ['L1'] }],
        } as unknown as BoardTileDB
        expect(getInitialFilterType(tile)).toBe('quaysFilter')
    })

    it('faller tilbake til stopPlaceFilter når verken filter eller tile.quays finnes', () => {
        const tile = {} as unknown as BoardTileDB
        expect(getInitialFilterType(tile)).toBe('stopPlaceFilter')
    })
})

describe('quaysToQuaysFilter (konverterer gammel tile.quays til QuaysFilterDB)', () => {
    it('mapper hver quay sin whitelistedLines over til filterformatet', () => {
        const result = quaysToQuaysFilter([
            { id: 'Q1', whitelistedLines: ['L1'] },
        ])
        expect(result).toEqual({
            type: 'quaysFilter',
            quays: [{ id: 'Q1', whitelistedLines: ['L1'] }],
        })
    })

    it('kopierer whitelistedLines-arrayen, slik at mutasjon av input ikke påvirker resultatet', () => {
        const inputQuay = { id: 'Q1', whitelistedLines: ['L1'] }
        const result = quaysToQuaysFilter([inputQuay])
        inputQuay.whitelistedLines.push('L2')
        expect(result.quays[0]?.whitelistedLines).toEqual(['L1'])
    })
})

describe('expandQuaysFilter (fyller inn underforståtte linjevalg per plattform)', () => {
    it('tom whitelistedLines på en lagret quay tolkes som «alle linjer på denne quayen»', () => {
        const filter: QuaysFilterDB = {
            type: 'quaysFilter',
            quays: [{ id: 'Q1', whitelistedLines: [] }],
        }
        const quays = [
            quay('Q1', [
                { id: 'L1', frontTexts: [] },
                { id: 'L2', frontTexts: [] },
            ]),
        ]
        expect(expandQuaysFilter(filter, quays)).toEqual({
            type: 'quaysFilter',
            quays: [{ id: 'Q1', whitelistedLines: ['L1', 'L2'] }],
        })
    })

    it('beholder eksplisitt valgte linjer uendret', () => {
        const filter: QuaysFilterDB = {
            type: 'quaysFilter',
            quays: [{ id: 'Q1', whitelistedLines: ['L1'] }],
        }
        const quays = [
            quay('Q1', [
                { id: 'L1', frontTexts: [] },
                { id: 'L2', frontTexts: [] },
            ]),
        ]
        expect(expandQuaysFilter(filter, quays)).toEqual({
            type: 'quaysFilter',
            quays: [{ id: 'Q1', whitelistedLines: ['L1'] }],
        })
    })

    it('en quay som mangler i filteret velges i sin helhet når filteret for øvrig er tomt', () => {
        const filter: QuaysFilterDB = { type: 'quaysFilter', quays: [] }
        const quays = [quay('Q1', [{ id: 'L1', frontTexts: [] }])]
        expect(expandQuaysFilter(filter, quays)).toEqual({
            type: 'quaysFilter',
            quays: [{ id: 'Q1', whitelistedLines: ['L1'] }],
        })
    })

    it('en quay som mangler i filteret får ingen linjer når andre quays allerede er eksplisitt filtrert', () => {
        const filter: QuaysFilterDB = {
            type: 'quaysFilter',
            quays: [{ id: 'Q2', whitelistedLines: ['L2'] }],
        }
        const quays = [
            quay('Q1', [{ id: 'L1', frontTexts: [] }]),
            quay('Q2', [{ id: 'L2', frontTexts: [] }]),
        ]
        expect(expandQuaysFilter(filter, quays)).toEqual({
            type: 'quaysFilter',
            quays: [
                { id: 'Q1', whitelistedLines: [] },
                { id: 'Q2', whitelistedLines: ['L2'] },
            ],
        })
    })
})

describe('getInitialQuaysFilter', () => {
    it('bruker tile.filter når det allerede er en quaysFilter', () => {
        const tile = {
            filter: {
                type: 'quaysFilter',
                quays: [{ id: 'Q1', whitelistedLines: ['L1'] }],
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
            quays: [{ id: 'Q1', whitelistedLines: ['L1'] }],
        })
    })

    it('bygger filteret fra gammel tile.quays når tile.filter mangler', () => {
        const tile = {
            quays: [{ id: 'Q1', whitelistedLines: ['L1'] }],
        } as unknown as BoardTileDB
        const quays = [quay('Q1', [{ id: 'L1', frontTexts: [] }])]
        expect(getInitialQuaysFilter(tile, quays)).toEqual({
            type: 'quaysFilter',
            quays: [{ id: 'Q1', whitelistedLines: ['L1'] }],
        })
    })
})

describe('compressQuaysFilter (fjerner underforstått informasjon før lagring)', () => {
    it('en quay uten valgte linjer droppes fra resultatet', () => {
        const quays = [quay('Q1', [{ id: 'L1', frontTexts: [] }])]
        const filter: QuaysFilterDB = {
            type: 'quaysFilter',
            quays: [{ id: 'Q1', whitelistedLines: [] }],
        }
        expect(compressQuaysFilter(filter, quays)).toEqual({
            type: 'quaysFilter',
            quays: [],
        })
    })

    it('en quay med alle linjer valgt komprimeres til tom whitelistedLines-liste', () => {
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
                { id: 'Q1', whitelistedLines: ['L1', 'L2'] },
                { id: 'Q2', whitelistedLines: [] },
            ],
        }
        expect(compressQuaysFilter(filter, quays)).toEqual({
            type: 'quaysFilter',
            quays: [{ id: 'Q1', whitelistedLines: [] }],
        })
    })

    it('en delvis valgt quay beholdes med eksplisitt linjeliste', () => {
        const quays = [
            quay('Q1', [
                { id: 'L1', frontTexts: [] },
                { id: 'L2', frontTexts: [] },
            ]),
        ]
        const filter: QuaysFilterDB = {
            type: 'quaysFilter',
            quays: [{ id: 'Q1', whitelistedLines: ['L1'] }],
        }
        expect(compressQuaysFilter(filter, quays)).toEqual({
            type: 'quaysFilter',
            quays: [{ id: 'Q1', whitelistedLines: ['L1'] }],
        })
    })

    it('når alle quays er fullt valgt, komprimeres hele filteret til en tom liste (betyr «alt valgt»)', () => {
        const quays = [
            quay('Q1', [{ id: 'L1', frontTexts: [] }]),
            quay('Q2', [{ id: 'L2', frontTexts: [] }]),
        ]
        const filter: QuaysFilterDB = {
            type: 'quaysFilter',
            quays: [
                { id: 'Q1', whitelistedLines: ['L1'] },
                { id: 'Q2', whitelistedLines: ['L2'] },
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

    it('en linje som finnes på flere plattformer vises kun én gang, med frontTexts slått sammen', () => {
        const quays = [
            quay('Q1', [
                { id: 'L1', frontTexts: ['Mot sentrum'], transportMode: 'bus' },
            ]),
            quay('Q2', [
                {
                    id: 'L1',
                    frontTexts: ['Mot sentrum', 'Mot Majorstua'],
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

describe('expandStopPlaceFilter (fyller inn underforståtte linjevalg per transportmiddel)', () => {
    const groups: TransportModeGroup[] = [
        { mode: 'bus', lines: [line('L1'), line('L2')] },
        { mode: 'tram', lines: [line('L3')] },
    ]

    it('ingen filtrering satt => alle linjer i alle grupper velges', () => {
        const filter: StopPlaceFilterDB = {
            type: 'stopPlaceFilter',
            whitelistedModes: [],
            whitelistedLines: [],
        }
        expect(expandStopPlaceFilter(filter, groups)).toEqual({
            type: 'stopPlaceFilter',
            whitelistedModes: [],
            whitelistedLines: ['L1', 'L2', 'L3'],
        })
    })

    it('whitelistedModes utvides til enkeltlinjer og slås sammen med eksplisitt valgte linjer', () => {
        const filter: StopPlaceFilterDB = {
            type: 'stopPlaceFilter',
            whitelistedModes: ['bus'],
            whitelistedLines: ['L3'],
        }
        const result = expandStopPlaceFilter(filter, groups)
        expect(result.whitelistedModes).toEqual([])
        expect(new Set(result.whitelistedLines)).toEqual(
            new Set(['L1', 'L2', 'L3']),
        )
    })
})

describe('getInitialStopPlaceFilter', () => {
    it('bruker tile.filter når det allerede er en stopPlaceFilter, og fyller inn linjer for valgte moduser', () => {
        const tile = {
            filter: {
                type: 'stopPlaceFilter',
                whitelistedModes: ['bus'],
                whitelistedLines: [],
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
            whitelistedModes: [],
            whitelistedLines: ['L1'],
        })
    })

    it('ingen lagret stopPlaceFilter => alle linjer på stoppestedet velges', () => {
        const tile = {} as unknown as BoardTileDB
        const quays = [
            quay('Q1', [{ id: 'L1', frontTexts: [], transportMode: 'bus' }]),
        ]
        expect(getInitialStopPlaceFilter(tile, quays)).toEqual({
            type: 'stopPlaceFilter',
            whitelistedModes: [],
            whitelistedLines: ['L1'],
        })
    })
})

describe('compressStopPlaceFilter (fjerner underforstått informasjon før lagring)', () => {
    const quays = [
        quay('Q1', [
            { id: 'L1', frontTexts: [], transportMode: 'bus' },
            { id: 'L2', frontTexts: [], transportMode: 'bus' },
            { id: 'L3', frontTexts: [], transportMode: 'tram' },
        ]),
    ]

    it('alle linjer valgt => komprimeres til tomme lister (betyr «alt valgt»)', () => {
        const filter: StopPlaceFilterDB = {
            type: 'stopPlaceFilter',
            whitelistedModes: [],
            whitelistedLines: ['L1', 'L2', 'L3'],
        }
        expect(compressStopPlaceFilter(filter, quays)).toEqual({
            type: 'stopPlaceFilter',
            whitelistedModes: [],
            whitelistedLines: [],
        })
    })

    it('alle linjer i én gruppe valgt => gruppen komprimeres til whitelistedModes', () => {
        const filter: StopPlaceFilterDB = {
            type: 'stopPlaceFilter',
            whitelistedModes: [],
            whitelistedLines: ['L1', 'L2'],
        }
        expect(compressStopPlaceFilter(filter, quays)).toEqual({
            type: 'stopPlaceFilter',
            whitelistedModes: ['bus'],
            whitelistedLines: [],
        })
    })

    it('delvis valgte linjer i en gruppe beholdes eksplisitt, og usette grupper utelates helt', () => {
        const filter: StopPlaceFilterDB = {
            type: 'stopPlaceFilter',
            whitelistedModes: [],
            whitelistedLines: ['L1'],
        }
        expect(compressStopPlaceFilter(filter, quays)).toEqual({
            type: 'stopPlaceFilter',
            whitelistedModes: [],
            whitelistedLines: ['L1'],
        })
    })
})
