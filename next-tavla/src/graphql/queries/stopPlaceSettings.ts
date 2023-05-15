import {
    TStopPlaceSettingsData,
    TStopPlaceSettingsDataVariables,
} from 'types/graphql'
import { createQuery, gql } from '../utils'

const stopPlaceSettingsQuery = createQuery<
    TStopPlaceSettingsData,
    TStopPlaceSettingsDataVariables
>(
    gql`
        query StopPlaceSettingsData($id: String!) {
            stopPlace(id: $id) {
                name
                quays(filterByInUse: true) {
                    lines {
                        id
                        publicCode
                        name
                    }
                }
            }
        }
    `,
)

export { stopPlaceSettingsQuery }
