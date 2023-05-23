import { createQuery, gql } from '../utils'
import { departureFragment } from '../fragments/departure'
import { TGetQuay, TGetQuayVariables } from 'types/graphql'
import { linesFragment } from 'graphql/fragments/lines'

const quayQuery = createQuery<TGetQuay, TGetQuayVariables>(
    gql`
        ${departureFragment}
        ${linesFragment}
        query getQuay(
            $quayId: String!
            $whitelistedTransportModes: [TransportMode]
            $whitelistedLines: [ID!]
        ) {
            quay(id: $quayId) {
                name
                description
                publicCode
                ...lines
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
