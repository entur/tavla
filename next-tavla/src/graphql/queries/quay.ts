import { createQuery, gql } from '../utils'
import { departureFragment } from '../fragments/departure'
import { TGetQuay, TGetQuayVariables } from '@/types/graphql'

const quayQuery = createQuery<TGetQuay, TGetQuayVariables>(
    gql`
        ${departureFragment}
        query getQuay(
            $quayId: String!
            $whitelistedTransportModes: [TransportMode]
            $whitelistedLines: [ID!]
        ) {
            quay(id: $quayId) {
                name
                description
                publicCode
                estimatedCalls(
                    numberOfDepartures: 20
                    whiteListedModes: $whitelistedTransportModes
                    whiteListed: { lines: $whitelistedLines }
                ) {
                    ...departure
                }
            }
        }
    `,
)

export { quayQuery }
