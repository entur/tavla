import { TBoard } from 'types/settings'

export const previewBoards: TBoard[] = [
    {
        id: 'aLr7VN03RDThtjYYfd9v',
        meta: {
            fontSize: 'medium',
        },
        tiles: [
            {
                columns: ['line', 'destination', 'time', 'realtime'],
                placeId: 'NSR:StopPlace:58293',
                name: 'Oslo bussterminal, Oslo',
                type: 'stop_place',
                uuid: 'hV659BA6dvQiRCIbNdIJR',
            },
        ],
    },
    {
        id: 'aLr7VN03RDThtjYYfd9v',
        meta: {
            fontSize: 'medium',
        },
        theme: 'light',

        tiles: [
            {
                columns: ['line', 'destination', 'time', 'realtime'],
                placeId: 'NSR:StopPlace:58382',
                name: 'Aker brygge, Oslo',
                type: 'stop_place',
                uuid: 'lqfe6yE6hStaM8yWbfmb2',
                whitelistedLines: [
                    'RUT:Line:3701',
                    'RUT:Line:3702',
                    'RUT:Line:3810',
                    'RUT:Line:3820',
                    'RUT:Line:3821',
                ],
            },
        ],
    },
    {
        id: 'aLr7VN03RDThtjYYfd9v',
        meta: {
            fontSize: 'small',
        },
        tiles: [
            {
                columns: [
                    'line',
                    'destination',
                    'time',
                    'realtime',
                    'aimedTime',
                    'arrivalTime',
                ],
                placeId: 'NSR:StopPlace:6479',
                name: 'CC vest, Oslo',
                type: 'stop_place',
                uuid: '8y-eAK8DVbuNQS8JYxTMf',
                walkingDistance: {
                    distance: 441,
                    visible: true,
                },
            },

            {
                columns: [
                    'line',
                    'destination',
                    'time',
                    'realtime',
                    'aimedTime',
                    'arrivalTime',
                ],
                placeId: 'NSR:StopPlace:58856',
                name: 'Lysaker stasjon, Bærum',
                type: 'stop_place',
                uuid: 'WPLoeygP7d173RifiQDvd',
                walkingDistance: {
                    distance: 868,
                    visible: true,
                },
            },
        ],
    },
    {
        id: 'aLr7VN03RDThtjYYfd9v',
        meta: {
            fontSize: 'large',
        },
        theme: 'light',
        tiles: [
            {
                columns: ['line', 'destination', 'time', 'realtime'],
                placeId: 'NSR:StopPlace:58287',
                name: 'Skøyen, Oslo',
                type: 'stop_place',
                uuid: '6hojyqhlUQXu53IZ5Jzyr',
            },
        ],
    },
]
