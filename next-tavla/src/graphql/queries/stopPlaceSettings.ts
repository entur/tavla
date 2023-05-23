import { linesFragment } from 'graphql/fragments/lines'
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
        ${linesFragment}
        query StopPlaceSettingsData($id: String!) {
            stopPlace(id: $id) {
                name
                quays(filterByInUse: true) {
                    ...lines
                }
            }
        }
    `,
)

export { stopPlaceSettingsQuery }
