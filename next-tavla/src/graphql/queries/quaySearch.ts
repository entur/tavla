import { createQuery, gql } from '../utils'

const quaySearchQuery = createQuery(
    gql`
        query getQuaysSearch($stopPlaceId: String!)
            stopPlace(id: $stopPlaceId) {
                quays(filterByInUse: true) {
                    id
                    publicCode
                    description
                }
            }
    `,
)

export { quaySearchQuery }
