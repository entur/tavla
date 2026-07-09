import type { BoardTileDB } from 'types/db-types/boards'
import { describe, expect, it } from 'vitest'
import type { QuayWithFrontText } from './types'
import {
    deriveLinesWithDirection,
    getInitialCheckedLineIds,
    parseTileFormData,
} from './utils'

/* Minimal fixture — deriveLinesWithDirection bruker kun quay.id og lines[].id/frontTexts, så vi caster forbi resten av TQuay-feltene.*/
function quay(
    id: string,
    lines: Array<{ id: string; frontTexts?: string[] }>,
): QuayWithFrontText {
    return { id, lines } as unknown as QuayWithFrontText
}

/* deriveLinesWithDirection(quays, selectedKeys):
 fra avhukede `${quayId}||${lineId}`-nøkler til `{ lineId, frontTexts }[]`.
 En retning (frontText) er quay-spesifikk — samme linje kan gå ulik vei fra ulike quays. Tom `frontTexts` betyr "alle retninger";
 er alle kjente retninger for en linje valgt, kollapses det til [] (så nye retninger blir med senere).
 */
describe('deriveLinesWithDirection', () => {
    it('tar bare med retningene fra de valgte quayene — samme linje kan gå ulik vei per quay, og en uvalgt quays retning skal ikke lekke inn', () => {
        const quays = [
            quay('Q1', [{ id: 'L1', frontTexts: ['Nord'] }]),
            quay('Q2', [{ id: 'L1', frontTexts: ['Sør'] }]),
        ]
        expect(deriveLinesWithDirection(quays, ['Q1||L1'])).toEqual([
            { lineId: 'L1', frontTexts: ['Nord'] },
        ])
    })

    it('kollapser frontTexts til [] ("alle retninger") når alle kjente retninger for linja er valgt, slik at nye framtidige retninger blir med automatisk', () => {
        const quays = [
            quay('Q1', [{ id: 'L1', frontTexts: ['Nord'] }]),
            quay('Q2', [{ id: 'L1', frontTexts: ['Sør'] }]),
        ]
        expect(deriveLinesWithDirection(quays, ['Q1||L1', 'Q2||L1'])).toEqual([
            { lineId: 'L1', frontTexts: [] },
        ])
    })

    it('gir frontTexts: [] ("alle retninger", fail-open) for en valgt linje som mangler frontText-data, i stedet for å droppe linja', () => {
        const quays = [quay('Q1', [{ id: 'L2', frontTexts: [] }])]
        expect(deriveLinesWithDirection(quays, ['Q1||L2'])).toEqual([
            { lineId: 'L2', frontTexts: [] },
        ])
    })

    it('returnerer [] når ingen quay-linje-par er valgt (intet linjefilter)', () => {
        const quays = [quay('Q1', [{ id: 'L1', frontTexts: ['Nord'] }])]
        expect(deriveLinesWithDirection(quays, [])).toEqual([])
    })

    it('tar bare med linjer som faktisk er valgt, ikke øvrige linjer på samme quay', () => {
        const quays = [
            quay('Q1', [
                { id: 'L1', frontTexts: ['Nord'] },
                { id: 'L2', frontTexts: ['Vest'] },
            ]),
        ]
        const result = deriveLinesWithDirection(quays, ['Q1||L1'])
        expect(result).toHaveLength(1)
        expect(result[0]?.lineId).toBe('L1')
    })

    it('sorterer frontTexts alfabetisk for deterministisk output, uavhengig av rekkefølgen de dukket opp i på quayene', () => {
        const quays = [
            quay('Q1', [{ id: 'L1', frontTexts: ['Storo', 'Bergkrystallen'] }]),
            quay('Q2', [{ id: 'L1', frontTexts: ['Sinsen'] }]),
        ]
        expect(deriveLinesWithDirection(quays, ['Q1||L1'])).toEqual([
            { lineId: 'L1', frontTexts: ['Bergkrystallen', 'Storo'] },
        ])
    })
})

/* parseTileFormData parser FormData fra admin-panelet til et objekt som kan brukes til å oppdatere en tile i databasen.*/
describe('parseTileFormData', () => {
    it('parser count-feltet til et tall (ikke streng) — regresjon: som streng ble allSelected-sammenligningen (keys.length === count) alltid false', () => {
        const data = new FormData()
        data.append('count', '3')
        const result = parseTileFormData(data)
        expect(result.count).toBe(3)
        expect(typeof result.count).toBe('number')
    })

    it('JSON-parser linesWithDirection-feltet, og returnerer [] når feltet mangler helt', () => {
        const withField = new FormData()
        withField.append(
            'linesWithDirection',
            JSON.stringify([{ lineId: 'L1', frontTexts: ['Nord'] }]),
        )
        expect(parseTileFormData(withField).linesWithDirection).toEqual([
            { lineId: 'L1', frontTexts: ['Nord'] },
        ])
        expect(parseTileFormData(new FormData()).linesWithDirection).toEqual([])
    })

    it('plukker ut kun checkbox-verdiene (quay-linje-par) i quayLineKeys og at øvrige navngitte felt (columns, displayName) parses korrekt', () => {
        const data = new FormData()
        data.append('count', '2')
        data.append('columns', 'line')
        data.append('offset', '0')
        data.append('displayName', 'Testnavn')
        data.append('linesWithDirection', '[]')
        data.append('tile-uuid-lines', 'Q1||L1')
        data.append('tile-uuid-lines', 'Q1||L2')

        const result = parseTileFormData(data)
        expect(result.quayLineKeys).toEqual(['Q1||L1', 'Q1||L2'])
        expect(result.columns).toEqual(['line'])
        expect(result.displayName).toBe('Testnavn')
    })
})
/* Minimal fixture — getInitialCheckedLineIds bruker kun tile.quays (id + whitelistedLines) og tile.whitelistedLines, så vi caster forbi resten av BoardTileDB-feltene.*/
function adminTile(
    quays: Array<{ id: string; whitelistedLines: string[] }>,
    whitelistedLines?: string[],
): BoardTileDB {
    return { quays, whitelistedLines } as unknown as BoardTileDB
}

/* getInitialCheckedLineIds(tile, quays): regner ut hvilke `${quayId}||${lineId}`-bokser som skal være forhåndsavhuket når en lagret tile åpnes.
 `quays` er linjene hentet fra API-et (fasit på hva som finnes nå);
 `tile` representerer det som er lagret i databasen*/
describe('getInitialCheckedLineIds (read-back-presedens)', () => {
    it('for quay lagret med en ikke-tom whitelistedLines returneres kun de linjene', () => {
        const tile = adminTile([{ id: 'Q1', whitelistedLines: ['L1'] }])
        const quays = [quay('Q1', [{ id: 'L1' }, { id: 'L2' }])]
        expect(getInitialCheckedLineIds(tile, quays)).toEqual(
            new Set(['Q1||L1']),
        )
    })

    it('for quay lagret med tom whitelistedLines tolkes [] som "alle linjer på quayen" og alle linjer returneres', () => {
        const tile = adminTile([{ id: 'Q1', whitelistedLines: [] }])
        const quays = [quay('Q1', [{ id: 'L1' }, { id: 'L2' }])]
        expect(getInitialCheckedLineIds(tile, quays)).toEqual(
            new Set(['Q1||L1', 'Q1||L2']),
        )
    })

    it('tile har en quay med whitelistedLines, på stoppet finnes det flere quays som ikke er lagret på tile. Da returneres kun kombinasjon av lagret quay og linje', () => {
        const tile = adminTile([{ id: 'Q1', whitelistedLines: ['L1'] }])
        const quays = [quay('Q1', [{ id: 'L1' }]), quay('Q2', [{ id: 'L3' }])]
        expect(getInitialCheckedLineIds(tile, quays)).toEqual(
            new Set(['Q1||L1']),
        )
    })

    it('når ingen quays lagret, men deprekert tile.whitelistedLines er satt så returneres alle kombinasjoner quay og valgt linje', () => {
        const tile = adminTile([], ['L1'])
        const quays = [
            quay('Q1', [{ id: 'L1' }, { id: 'L2' }]),
            quay('Q2', [{ id: 'L1' }, { id: 'L3' }]),
            quay('Q3', [{ id: 'L2' }, { id: 'L3' }]),
        ]
        expect(getInitialCheckedLineIds(tile, quays)).toEqual(
            new Set(['Q1||L1', 'Q2||L1']),
        )
    })

    it('verken quays eller tile.whitelistedLines er satt så alle kombinasjoner returneres', () => {
        const tile = adminTile([])
        const quays = [quay('Q1', [{ id: 'L1' }, { id: 'L2' }])]
        expect(getInitialCheckedLineIds(tile, quays)).toEqual(
            new Set(['Q1||L1', 'Q1||L2']),
        )
    })
})
