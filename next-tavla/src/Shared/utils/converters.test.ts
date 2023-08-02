import { upgradeSettings } from './converters'
import { expect, test } from '@jest/globals'

test('upgrade settings to latest version', () => {
    const upgradedSettings = upgradeSettings({
        tiles: [
            {
                type: 'stop_place',
                columns: ['platform', 'line', 'destination', 'time'],
                placeId: 'NSR:StopPlace:60066',
                name: 'Trondheim hurtigbåtterminal',
                uuid: '1',
            },
            {
                type: 'quay',
                placeId: 'NSR:Quay:7184',
                name: 'Jernbanetorget',
                stopPlaceId: 'NSR:StopPlace:58366',
                columns: ['time'],
                uuid: '2',
            },
        ],
    })

    expect(upgradedSettings).toStrictEqual({
        tiles: [
            {
                type: 'stop_place',
                columns: ['platform', 'line', 'destination', 'time'],
                placeId: 'NSR:StopPlace:60066',
                name: 'Trondheim hurtigbåtterminal',
                uuid: '1',
            },
            {
                type: 'quay',
                placeId: 'NSR:Quay:7184',
                name: 'Jernbanetorget',
                stopPlaceId: 'NSR:StopPlace:58366',
                columns: ['time'],
                uuid: '2',
            },
        ],
        version: 1,
    })
})
