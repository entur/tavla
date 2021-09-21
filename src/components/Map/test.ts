import { HttpLink, ApolloClient, gql, InMemoryCache } from '@apollo/client'

export const TEST_QUERY = gql`
    query TestQuery($ids: [String]!) {
        lines(ids: $ids) {
            id
            journeyPatterns {
                line {
                    publicCode
                    name
                }
                destinationDisplay {
                    frontText
                }
            }
        }
    }
`

const link = new HttpLink({
    uri: 'https://api.staging.entur.io/journey-planner/v2/graphql',
})

export const testClient = new ApolloClient({
    link,
    cache: new InMemoryCache({
        addTypename: false,
    }),
})

export interface ITest {
    id: string
    journeyPatterns: Array<{
        line: {
            publicCode: string
            name: string
        }
        destinationDisplay: {
            frontText: string
        }
    }>
}

export interface IResponse {
    lines: ITest[]
}
