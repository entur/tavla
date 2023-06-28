import {
    V1,
    V2,
    V3,
    convertSettingsVersion,
    currentVersion,
} from './converters'
import { expect, test } from '@jest/globals'

test('upgrade from base to v1', () => {
    const v1 = V1({
        tiles: [
            {
                type: 'stop_place',
                columns: ['platform', 'line', 'destination', 'time'],
                placeId: 'NSR:StopPlace:60066',
            },
            {
                placeId: 'NSR:StopPlace:20123',
                columns: ['time'],
                type: 'stop_place',
            },
        ],
    })

    expect(v1).toStrictEqual({
        tiles: [
            {
                type: 'stop_place',
                placeId: 'NSR:StopPlace:60066',
                columns: [
                    {
                        type: 'platform',
                    },
                    {
                        type: 'line',
                    },
                    {
                        type: 'destination',
                    },
                    {
                        type: 'time',
                    },
                ],
            },
            {
                columns: [
                    {
                        type: 'time',
                    },
                ],
                placeId: 'NSR:StopPlace:20123',
                type: 'stop_place',
            },
        ],
    })
})

test('upgrade from v1 to v2', () => {
    const v2 = V2({
        tiles: [
            {
                type: 'stop_place',
                placeId: 'NSR:StopPlace:60066',
                columns: [
                    {
                        type: 'platform',
                    },
                    {
                        type: 'line',
                    },
                    {
                        type: 'destination',
                    },
                    {
                        type: 'time',
                    },
                ],
            },
            {
                columns: [
                    {
                        type: 'time',
                    },
                ],
                placeId: 'NSR:StopPlace:20123',
                type: 'stop_place',
            },
        ],
    })

    expect(v2).toStrictEqual({
        tiles: [
            {
                type: 'stop_place',
                placeId: 'NSR:StopPlace:60066',
                uuid: '1234',
                columns: [
                    {
                        type: 'platform',
                    },
                    {
                        type: 'line',
                    },
                    {
                        type: 'destination',
                    },
                    {
                        type: 'time',
                    },
                ],
            },
            {
                uuid: '1234',
                columns: [
                    {
                        type: 'time',
                    },
                ],
                placeId: 'NSR:StopPlace:20123',
                type: 'stop_place',
            },
        ],
    })
})

test('upgrade from v2 to v3', () => {
    const v3 = V3({
        theme: 'default',
        tiles: [
            {
                type: 'stop_place',
                placeId: 'NSR:StopPlace:60066',
                uuid: '1234',
                columns: [
                    {
                        type: 'platform',
                    },
                    {
                        type: 'line',
                    },
                    {
                        type: 'destination',
                    },
                    {
                        type: 'time',
                    },
                ],
            },
            {
                uuid: '1234',
                columns: [
                    {
                        type: 'time',
                    },
                ],
                placeId: 'NSR:StopPlace:20123',
                type: 'stop_place',
            },
        ],
    })

    expect(v3).toStrictEqual({
        theme: 'entur',
        tiles: [
            {
                type: 'stop_place',
                placeId: 'NSR:StopPlace:60066',
                uuid: '1234',
                columns: [
                    {
                        type: 'platform',
                    },
                    {
                        type: 'line',
                    },
                    {
                        type: 'destination',
                    },
                    {
                        type: 'time',
                    },
                ],
            },
            {
                uuid: '1234',
                columns: [
                    {
                        type: 'time',
                    },
                ],
                placeId: 'NSR:StopPlace:20123',
                type: 'stop_place',
            },
        ],
    })
})

test('upgrade from base to latest version', () => {
    const start = {
        tiles: [
            {
                type: 'stop_place',
                columns: ['platform', 'line', 'destination', 'time'],
                placeId: 'NSR:StopPlace:60066',
            },
            {
                placeId: 'NSR:StopPlace:20123',
                columns: ['time'],
                type: 'stop_place',
            },
        ],
    }

    const end = {
        version: currentVersion,
        theme: 'dark',
        tiles: [
            {
                type: 'stop_place',
                placeId: 'NSR:StopPlace:60066',
                uuid: '1234',
                columns: [
                    {
                        type: 'platform',
                    },
                    {
                        type: 'line',
                    },
                    {
                        type: 'destination',
                    },
                    {
                        type: 'time',
                    },
                ],
            },
            {
                uuid: '1234',
                columns: [
                    {
                        type: 'time',
                    },
                ],
                placeId: 'NSR:StopPlace:20123',
                type: 'stop_place',
            },
        ],
    }

    expect(convertSettingsVersion(start)).toStrictEqual(end)
})
