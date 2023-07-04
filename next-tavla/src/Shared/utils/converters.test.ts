import {
    V1,
    V2,
    V3,
    V4,
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
                placeId: 'NSR:Quay:404',
                columns: ['time'],
                type: 'quay',
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
                placeId: 'NSR:Quay:404',
                type: 'quay',
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
                placeId: 'NSR:Quay:404',
                type: 'quay',
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
                placeId: 'NSR:Quay:404',
                type: 'quay',
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
                placeId: 'NSR:Quay:404',
                type: 'quay',
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
                placeId: 'NSR:Quay:404',
                type: 'quay',
            },
        ],
    })
})
test('upgrade from v3 to v4', () => {
    const v4 = V4({
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
                placeId: 'NSR:Quay:404',
                type: 'quay',
            },
        ],
    })

    expect(v4).toStrictEqual({
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
                stopPlaceId: '',
                placeId: 'NSR:Quay:404',
                type: 'quay',
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
                placeId: 'NSR:Quay:404',
                columns: ['time'],
                type: 'quay',
            },
        ],
    }

    const end = {
        version: currentVersion,
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
                stopPlaceId: '',
                placeId: 'NSR:Quay:404',
                type: 'quay',
            },
        ],
    }

    expect(convertSettingsVersion(start)).toStrictEqual(end)
})
