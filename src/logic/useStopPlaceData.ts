import { gql, useQuery } from '@apollo/client'

import { FormFactor } from '@entur/sdk/lib/mobility/types'

import { useSettingsContext } from '../settings'

const GET_STOPPLACES = gql`
    query getStopPlaces(
        $formFactor: [FormFactor]
        $longitude: Float!
        $latitude: Float!
    ) {
        stations(
            lat: $latitude
            lon: $longitude
            range: 500
            count: 25
            availableFormFactors: $formFactor
        ) {
            lat
            lon
            id
            numBikesAvailable
            numDocksAvailable
            name {
                translation {
                    value
                    language
                }
            }
            system {
                name {
                    translation {
                        language
                        value
                    }
                }
            }
        }
    }
`

export const useStopPlaceData = (mobilityType: FormFactor) => {
    const [settings] = useSettingsContext()
    const { coordinates } = settings || {}

    const response = useQuery(GET_STOPPLACES, {
        variables: {
            formFactor: mobilityType,
            latitude: coordinates?.latitude,
            longitude: coordinates?.longitude,
        },
        context: {
            endPoint: 'mobility',
        },
    })
    return response
}
