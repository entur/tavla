import { V1, V2, convertSettingsVersion, currentVersion } from './converters'

jest.mock('nanoid', () => {
    return { nanoid: () => '1234' }
})

test('upgrade from base to v2', () => {
    const v2 = V1({
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

    expect(v2).toStrictEqual({
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

test('upgrade from v2 to v3', () => {
    const v3 = V2({
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

    expect(v3).toStrictEqual({
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
