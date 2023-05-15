import { TGetQuaysSearch, TGetQuaysSearchVariables } from 'types/graphql'
import { createQuery, gql } from '../utils'

const quaySearchQuery = createQuery<TGetQuaysSearch, TGetQuaysSearchVariables>(
    gql`
        query getQuaysSearch($stopPlaceId: String!) {
            stopPlace(id: $stopPlaceId) {
                quays(filterByInUse: true) {
                    id
                    publicCode
                    description
                }
            }
        }
    `,
)

export { quaySearchQuery }
