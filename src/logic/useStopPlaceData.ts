import { gql, useQuery } from '@apollo/client'
import { FormFactor } from '@entur/sdk/lib/mobility/types'
import { useSettings } from '../settings/SettingsProvider'
import { Endpoints } from '../services/realtimeVehicles/realtimeVehiclesService'

const GET_STOP_PLACES = gql`
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
    const [settings] = useSettings()
    const { coordinates } = settings || {}

    const response = useQuery(GET_STOP_PLACES, {
        variables: {
            formFactor: mobilityType,
            latitude: coordinates?.latitude,
            longitude: coordinates?.longitude,
        },
        context: {
            endPoint: Endpoints.Mobility,
        },
    })
    return response
}
