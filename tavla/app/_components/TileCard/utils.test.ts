import { describe, expect, it } from 'vitest'
import { parseTileFormData } from './utils'

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
