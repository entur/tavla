import { describe, expect, test, jest } from '@jest/globals'
import {
    createTimeString,
    getFeedbackString,
    timeSince,
    timeUntil,
} from './time'

describe('time utils', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-03-03'))

    test('time string creation from date', () => {
        const date = new Date()
        expect(createTimeString(date)).toBe('fredag 3. mars  01:00')
    })
    test('feedback string from duration', () => {
        expect(getFeedbackString(30)).toBe('30 sekunder siden')
        expect(getFeedbackString(60)).toBe('> 1 minutt siden')
        expect(getFeedbackString(120)).toBe('> 2 minutter siden')
        expect(getFeedbackString(245)).toBe('> 4 minutter siden')
    })

    test('time until date in seconds', () => {
        const date = new Date('2023-03-04')
        expect(timeUntil(date)).toBe(24 * 60 * 60)
    })

    test('time since date in seconds', () => {
        const date = new Date('2023-03-02')
        expect(timeSince(date.toISOString())).toBe(24 * 60 * 60)
    })
})
