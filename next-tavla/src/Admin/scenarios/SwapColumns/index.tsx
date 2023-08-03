import { Heading2 } from '@entur/typography'
import { Table } from 'Board/scenarios/Table'
import { TTile } from 'types/tile'

function SwapColumn({ tile }: { tile: TTile }) {
    const departures = [
        {
            quay: {
                publicCode: '2',
            },
            destinationDisplay: {
                frontText: 'Sognsvann',
                via: [],
            },
            aimedDepartureTime: '2023-08-02T13:05:00+02:00',
            expectedDepartureTime: '2023-08-02T13:06:14+02:00',
            serviceJourney: {
                id: 'RUT:ServiceJourney:5-183384-27224747',
                transportMode: 'metro',
                transportSubmode: 'metro',
                line: {
                    id: 'RUT:Line:5',
                    publicCode: '5',
                    presentation: {
                        textColour: 'FFFFFF',
                        colour: 'EC700C',
                    },
                },
            },
            cancellation: false,
            situations: [],
        },
        {
            quay: {
                publicCode: '2',
            },
            destinationDisplay: {
                frontText: 'Frognerseteren',
                via: [],
            },
            aimedDepartureTime: '2023-08-02T13:07:00+02:00',
            expectedDepartureTime: '2023-08-02T13:07:00+02:00',
            serviceJourney: {
                id: 'RUT:ServiceJourney:1-183384-27228489',
                transportMode: 'metro',
                transportSubmode: 'metro',
                line: {
                    id: 'RUT:Line:1',
                    publicCode: '1',
                    presentation: {
                        textColour: 'FFFFFF',
                        colour: 'EC700C',
                    },
                },
            },
            cancellation: false,
            situations: [],
        },
        {
            quay: {
                publicCode: '2',
            },
            destinationDisplay: {
                frontText: 'Ringen via Majorstuen',
                via: [],
            },
            aimedDepartureTime: '2023-08-02T13:09:00+02:00',
            expectedDepartureTime: '2023-08-02T13:10:15+02:00',
            serviceJourney: {
                id: 'RUT:ServiceJourney:5-183384-27224749',
                transportMode: 'metro',
                transportSubmode: 'metro',
                line: {
                    id: 'RUT:Line:5',
                    publicCode: '5',
                    presentation: {
                        textColour: 'FFFFFF',
                        colour: 'EC700C',
                    },
                },
            },
            cancellation: false,
            situations: [],
        },
        {
            quay: {
                publicCode: '2',
            },
            destinationDisplay: {
                frontText: 'Kolsås',
                via: ['Sentrum'],
            },
            aimedDepartureTime: '2023-08-02T13:13:00+02:00',
            expectedDepartureTime: '2023-08-02T13:13:00+02:00',
            serviceJourney: {
                id: 'RUT:ServiceJourney:3-183384-27225339',
                transportMode: 'metro',
                transportSubmode: 'metro',
                line: {
                    id: 'RUT:Line:3',
                    publicCode: '3',
                    presentation: {
                        textColour: 'FFFFFF',
                        colour: 'EC700C',
                    },
                },
            },
        },
    ]
    return (
        <>
            <Heading2>Forhåndsvisning av holdeplass</Heading2>
            <div
                data-theme="dark"
                style={{
                    backgroundColor: 'var(--main-background-color)',
                    borderRadius: '1em',
                    padding: '1em',
                    marginTop: '2em',
                }}
            >
                <Table departures={departures} columns={tile.columns} />
            </div>
        </>
    )
}
export { SwapColumn }
