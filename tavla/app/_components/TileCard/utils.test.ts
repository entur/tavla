import type { BoardTileDB } from 'types/db-types/boards'
import { describe, expect, it } from 'vitest'
import type { QuayWithFrontText } from './types'
import {
    deriveLinesWithDirection,
    getInitialCheckedLineIds,
    parseTileFormData,
} from './utils'

// Minimal fixture — deriveLinesWithDirection bruker kun quay.id og
// lines[].id/frontTexts, så vi caster forbi resten av TQuay-feltene.
function quay(
    id: string,
    lines: Array<{ id: string; frontTexts?: string[] }>,
): QuayWithFrontText {
    return { id, lines } as unknown as QuayWithFrontText
}

describe('deriveLinesWithDirection', () => {
    it('beholder spesifikk retning når bare én plattform er valgt (subset på tvers av quays)', () => {
        const quays = [
            quay('Q1', [{ id: 'L1', frontTexts: ['Nord'] }]),
            quay('Q2', [{ id: 'L1', frontTexts: ['Sør'] }]),
        ]
        expect(deriveLinesWithDirection(quays, ['Q1||L1'])).toEqual([
            { lineId: 'L1', frontTexts: ['Nord'] },
        ])
    })

    it('kollapser til [] når alle kjente retninger for en linje er valgt', () => {
        const quays = [
            quay('Q1', [{ id: 'L1', frontTexts: ['Nord'] }]),
            quay('Q2', [{ id: 'L1', frontTexts: ['Sør'] }]),
        ]
        expect(deriveLinesWithDirection(quays, ['Q1||L1', 'Q2||L1'])).toEqual([
            { lineId: 'L1', frontTexts: [] },
        ])
    })

    it('gir [] (alle retninger) for en valgt linje uten frontTexts (fail-open)', () => {
        const quays = [quay('Q1', [{ id: 'L2', frontTexts: [] }])]
        expect(deriveLinesWithDirection(quays, ['Q1||L2'])).toEqual([
            { lineId: 'L2', frontTexts: [] },
        ])
    })

    it('returnerer tom liste når ingenting er valgt', () => {
        const quays = [quay('Q1', [{ id: 'L1', frontTexts: ['Nord'] }])]
        expect(deriveLinesWithDirection(quays, [])).toEqual([])
    })

    it('tar bare med valgte linjer', () => {
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

    it('sorterer frontTexts deterministisk', () => {
        const quays = [
            quay('Q1', [{ id: 'L1', frontTexts: ['Storo', 'Bergkrystallen'] }]),
            quay('Q2', [{ id: 'L1', frontTexts: ['Sinsen'] }]),
        ]
        // Q1 valgt (Storo + Bergkrystallen), Q2 (Sinsen) ikke → subset, sortert
        expect(deriveLinesWithDirection(quays, ['Q1||L1'])).toEqual([
            { lineId: 'L1', frontTexts: ['Bergkrystallen', 'Storo'] },
        ])
    })
})

describe('parseTileFormData', () => {
    it('parser count som number (regresjon: allSelected ble alltid false)', () => {
        const data = new FormData()
        data.append('count', '3')
        const result = parseTileFormData(data)
        expect(result.count).toBe(3)
        expect(typeof result.count).toBe('number')
    })

    it('parser linesWithDirection fra JSON; fravær gir []', () => {
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

    it('samler kun checkbox-verdiene i quayLineKeys', () => {
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

function adminTile(
    quays: Array<{ id: string; whitelistedLines: string[] }>,
    whitelistedLines?: string[],
): BoardTileDB {
    return { quays, whitelistedLines } as unknown as BoardTileDB
}

describe('getInitialCheckedLineIds (read-back-presedens)', () => {
    it('savedQuay med whitelist → kun de linjene', () => {
        const tile = adminTile([{ id: 'Q1', whitelistedLines: ['L1'] }])
        const quays = [quay('Q1', [{ id: 'L1' }, { id: 'L2' }])]
        expect(getInitialCheckedLineIds(tile, quays)).toEqual(
            new Set(['Q1||L1']),
        )
    })

    it('savedQuay med tom whitelist → alle linjer på quayen', () => {
        const tile = adminTile([{ id: 'Q1', whitelistedLines: [] }])
        const quays = [quay('Q1', [{ id: 'L1' }, { id: 'L2' }])]
        expect(getInitialCheckedLineIds(tile, quays)).toEqual(
            new Set(['Q1||L1', 'Q1||L2']),
        )
    })

    it('quay-filter finnes, men quay mangler i tile.quays → ingenting for den', () => {
        const tile = adminTile([{ id: 'Q1', whitelistedLines: ['L1'] }])
        const quays = [quay('Q1', [{ id: 'L1' }]), quay('Q2', [{ id: 'L3' }])]
        expect(getInitialCheckedLineIds(tile, quays)).toEqual(
            new Set(['Q1||L1']),
        )
    })

    it('intet quay-filter + tile.whitelistedLines → de linjene på tvers av quays', () => {
        const tile = adminTile([], ['L1'])
        const quays = [quay('Q1', [{ id: 'L1' }, { id: 'L2' }])]
        expect(getInitialCheckedLineIds(tile, quays)).toEqual(
            new Set(['Q1||L1']),
        )
    })

    it('intet filter → alt valgt', () => {
        const tile = adminTile([])
        const quays = [quay('Q1', [{ id: 'L1' }, { id: 'L2' }])]
        expect(getInitialCheckedLineIds(tile, quays)).toEqual(
            new Set(['Q1||L1', 'Q1||L2']),
        )
    })
})

describe('deriveLinesWithDirection', () => {
    it('beholder spesifikk retning når bare én plattform er valgt (subset på tvers av quays)', () => {
        const quays = [
            quay('Q1', [{ id: 'L1', frontTexts: ['Nord'] }]),
            quay('Q2', [{ id: 'L1', frontTexts: ['Sør'] }]),
        ]
        expect(deriveLinesWithDirection(quays, ['Q1||L1'])).toEqual([
            { lineId: 'L1', frontTexts: ['Nord'] },
        ])
    })

    it('kollapser til [] når alle kjente retninger for en linje er valgt', () => {
        const quays = [
            quay('Q1', [{ id: 'L1', frontTexts: ['Nord'] }]),
            quay('Q2', [{ id: 'L1', frontTexts: ['Sør'] }]),
        ]
        expect(deriveLinesWithDirection(quays, ['Q1||L1', 'Q2||L1'])).toEqual([
            { lineId: 'L1', frontTexts: [] },
        ])
    })

    it('gir [] (alle retninger) for en valgt linje uten frontTexts (fail-open)', () => {
        const quays = [quay('Q1', [{ id: 'L2', frontTexts: [] }])]
        expect(deriveLinesWithDirection(quays, ['Q1||L2'])).toEqual([
            { lineId: 'L2', frontTexts: [] },
        ])
    })

    it('returnerer tom liste når ingenting er valgt', () => {
        const quays = [quay('Q1', [{ id: 'L1', frontTexts: ['Nord'] }])]
        expect(deriveLinesWithDirection(quays, [])).toEqual([])
    })

    it('tar bare med valgte linjer', () => {
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

    it('sorterer frontTexts deterministisk', () => {
        const quays = [
            quay('Q1', [{ id: 'L1', frontTexts: ['Storo', 'Bergkrystallen'] }]),
            quay('Q2', [{ id: 'L1', frontTexts: ['Sinsen'] }]),
        ]
        // Q1 valgt (Storo + Bergkrystallen), Q2 (Sinsen) ikke → subset, sortert
        expect(deriveLinesWithDirection(quays, ['Q1||L1'])).toEqual([
            { lineId: 'L1', frontTexts: ['Bergkrystallen', 'Storo'] },
        ])
    })
})

describe('parseTileFormData', () => {
    it('parser count som number (regresjon: allSelected ble alltid false)', () => {
        const data = new FormData()
        data.append('count', '3')
        const result = parseTileFormData(data)
        expect(result.count).toBe(3)
        expect(typeof result.count).toBe('number')
    })

    it('parser linesWithDirection fra JSON; fravær gir []', () => {
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

    it('samler kun checkbox-verdiene i quayLineKeys', () => {
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
