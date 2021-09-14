import { gql } from '@apollo/client'

const VEHICLE_FRAGMENT = gql`
    fragment VehicleFragment on VehicleUpdate {
        vehicleRef
        codespace {
            codespaceId
        }
        operator {
            operatorRef
        }
        line {
            lineName
            lineRef
        }
        serviceJourney {
            serviceJourneyId
        }
        direction
        mode
        lastUpdated
        lastUpdatedEpochSecond
        expiration
        expirationEpochSecond
        speed
        heading
        monitored
        delay
        location {
            latitude
            longitude
        }
    }
`

export const VEHICLES_QUERY = gql`
    query VehiclesQuery(
        $codespaceId: String
        $lineRef: String
        $serviceJourneyId: String
        $operatorRef: String
        $mode: VehicleModeEnumeration
        $monitored: Boolean
    ) {
        vehicles(
            codespaceId: $codespaceId
            lineRef: $lineRef
            serviceJourneyId: $serviceJourneyId
            operatorRef: $operatorRef
            mode: $mode
            monitored: $monitored
        ) {
            ...VehicleFragment
        }
    }
    ${VEHICLE_FRAGMENT}
`

export const VEHICLE_UPDATES_SUBSCRIPTION = gql`
    subscription VehicleUpdates(
        $codespaceId: String
        $lineRef: String
        $serviceJourneyId: String
        $operatorRef: String
        $mode: VehicleModeEnumeration
        $monitored: Boolean
        $bufferSize: Int
        $bufferTime: Int
    ) {
        vehicleUpdates(
            codespaceId: $codespaceId
            lineRef: $lineRef
            serviceJourneyId: $serviceJourneyId
            operatorRef: $operatorRef
            mode: $mode
            monitored: $monitored
            bufferSize: $bufferSize
            bufferTime: $bufferTime
        ) {
            ...VehicleFragment
        }
    }
    ${VEHICLE_FRAGMENT}
`

export const CODESPACES_QUERY = gql`
    query CodespacesQuery {
        codespaces {
            codespaceId
        }
    }
`

export const OPERATORS_QUERY = gql`
    query OperatorsQuery($codespaceId: String!) {
        operators(codespaceId: $codespaceId) {
            operatorRef
        }
    }
`

export const LINES_QUERY = gql`
    query LinesQuery($codespaceId: String) {
        lines(codespaceId: $codespaceId) {
            lineRef
            lineName
        }
    }
`

export const SERVICE_JOURNEYS_QUERY = gql`
    query ServiceJourneysQuery($lineRef: String!) {
        serviceJourneys(lineRef: $lineRef) {
            serviceJourneyId
        }
    }
`
