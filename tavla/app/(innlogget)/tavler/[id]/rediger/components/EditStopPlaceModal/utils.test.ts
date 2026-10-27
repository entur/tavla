import type { BoardTileDB } from 'types/db-types/boards'
import { describe, expect, it } from 'vitest'
import type { QuayWithFrontText } from '../utils/types'
import { getInitialCheckedLineIds } from './utils'

/* Minimal fixture — getInitialCheckedLineIds bruker kun quay.id og lines[].id, så vi caster forbi resten av TQuay-feltene.*/
function quay(
    id: string,
    lines: Array<{ id: string; frontTexts: string[] }>,
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
