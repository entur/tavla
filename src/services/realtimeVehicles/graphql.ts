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
        $boundingBox: BoundingBox
    ) @api(name: vehicles) {
        vehicles(
            codespaceId: $codespaceId
            lineRef: $lineRef
            serviceJourneyId: $serviceJourneyId
            operatorRef: $operatorRef
            mode: $mode
            monitored: $monitored
            boundingBox: $boundingBox
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
        $boundingBox: BoundingBox
    ) @api(name: vehicles) {
        vehicleUpdates(
            codespaceId: $codespaceId
            lineRef: $lineRef
            serviceJourneyId: $serviceJourneyId
            operatorRef: $operatorRef
            mode: $mode
            monitored: $monitored
            bufferSize: $bufferSize
            bufferTime: $bufferTime
            boundingBox: $boundingBox
        ) {
            ...VehicleFragment
        }
    }
    ${VEHICLE_FRAGMENT}
`
