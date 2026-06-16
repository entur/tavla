/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
    | T
    | {
          [P in keyof T]?: P extends ' $fragmentName' | '__typename'
              ? T[P]
              : never
      }

import type * as Types from 'types/graphql-schema'

export type TArrivalDeparture =
    /** Only show arrivals */
    | 'arrivals'
    /** Show both arrivals and departures */
    | 'both'
    /** Only show departures */
    | 'departures'

/** Input type for coordinates in the WGS84 system */
export type TInputCoordinates = {
    /** The latitude of the place. */
    latitude: number
    /** The longitude of the place. */
    longitude: number
}

export type TMode =
    | 'air'
    | 'bicycle'
    | 'bus'
    | 'cableway'
    | 'car'
    | 'coach'
    | 'foot'
    | 'funicular'
    | 'lift'
    | 'metro'
    | 'monorail'
    | 'rail'
    | 'scooter'
    | 'taxi'
    | 'tram'
    | 'trolleybus'
    | 'water'

export type TTransportMode =
    | 'air'
    | 'bus'
    | 'cableway'
    | 'coach'
    | 'funicular'
    | 'lift'
    | 'metro'
    | 'monorail'
    | 'rail'
    | 'taxi'
    | 'tram'
    | 'trolleybus'
    | 'unknown'
    | 'water'

export type TTransportSubmode =
    | 'SchengenAreaFlight'
    | 'airportBoatLink'
    | 'airportLinkBus'
    | 'airportLinkRail'
    | 'airshipService'
    | 'allFunicularServices'
    | 'allHireVehicles'
    | 'allTaxiServices'
    | 'bikeTaxi'
    | 'blackCab'
    | 'cableCar'
    | 'cableFerry'
    | 'canalBarge'
    | 'carTransportRailService'
    | 'chairLift'
    | 'charterTaxi'
    | 'cityTram'
    | 'communalTaxi'
    | 'commuterCoach'
    | 'crossCountryRail'
    | 'dedicatedLaneBus'
    | 'demandAndResponseBus'
    | 'domesticCharterFlight'
    | 'domesticFlight'
    | 'domesticScheduledFlight'
    | 'dragLift'
    | 'expressBus'
    | 'funicular'
    | 'helicopterService'
    | 'highFrequencyBus'
    | 'highSpeedPassengerService'
    | 'highSpeedRail'
    | 'highSpeedVehicleService'
    | 'hireCar'
    | 'hireCycle'
    | 'hireMotorbike'
    | 'hireVan'
    | 'intercontinentalCharterFlight'
    | 'intercontinentalFlight'
    | 'international'
    | 'internationalCarFerry'
    | 'internationalCharterFlight'
    | 'internationalCoach'
    | 'internationalFlight'
    | 'internationalPassengerFerry'
    | 'interregionalRail'
    | 'lift'
    | 'local'
    | 'localBus'
    | 'localCarFerry'
    | 'localPassengerFerry'
    | 'localTram'
    | 'longDistance'
    | 'metro'
    | 'miniCab'
    | 'mobilityBus'
    | 'mobilityBusForRegisteredDisabled'
    | 'nationalCarFerry'
    | 'nationalCoach'
    | 'nationalPassengerFerry'
    | 'nightBus'
    | 'nightRail'
    | 'postBoat'
    | 'postBus'
    | 'rackAndPinionRailway'
    | 'railReplacementBus'
    | 'railShuttle'
    | 'railTaxi'
    | 'regionalBus'
    | 'regionalCarFerry'
    | 'regionalCoach'
    | 'regionalPassengerFerry'
    | 'regionalRail'
    | 'regionalTram'
    | 'replacementRailService'
    | 'riverBus'
    | 'roadFerryLink'
    | 'roundTripCharterFlight'
    | 'scheduledFerry'
    | 'schoolAndPublicServiceBus'
    | 'schoolBoat'
    | 'schoolBus'
    | 'schoolCoach'
    | 'shortHaulInternationalFlight'
    | 'shuttleBus'
    | 'shuttleCoach'
    | 'shuttleFerryService'
    | 'shuttleFlight'
    | 'shuttleTram'
    | 'sightseeingBus'
    | 'sightseeingCoach'
    | 'sightseeingFlight'
    | 'sightseeingService'
    | 'sightseeingTram'
    | 'sleeperRailService'
    | 'specialCoach'
    | 'specialNeedsBus'
    | 'specialTrain'
    | 'streetCableCar'
    | 'suburbanRailway'
    | 'telecabin'
    | 'telecabinLink'
    | 'touristCoach'
    | 'touristRailway'
    | 'trainFerry'
    | 'trainTram'
    | 'tube'
    | 'undefined'
    | 'undefinedFunicular'
    | 'unknown'
    | 'urbanRailway'
    | 'waterTaxi'

export type TDepartureFragment = {
    aimedDepartureTime: DateTime
    expectedDepartureTime: DateTime
    expectedArrivalTime: DateTime
    cancellation: boolean
    realtime: boolean
    quay: { publicCode: string | null; name: string }
    destinationDisplay: {
        frontText: string | null
        via: Array<string | null> | null
    } | null
    serviceJourney: {
        id: string
        transportMode: Types.TTransportMode | null
        transportSubmode: Types.TTransportSubmode | null
        line: {
            id: string
            publicCode: string | null
            presentation: {
                textColour: string | null
                colour: string | null
            } | null
        }
    }
    situations: Array<{
        id: string
        description: Array<{ value: string; language: string | null }>
        summary: Array<{ value: string; language: string | null }>
    }>
}

export type TLinesFragment = {
    lines: Array<{
        id: string
        publicCode: string | null
        name: string | null
        transportMode: Types.TTransportMode | null
        transportSubmode: Types.TTransportSubmode | null
    }>
}

export type TSituationFragment = {
    id: string
    description: Array<{ value: string; language: string | null }>
    summary: Array<{ value: string; language: string | null }>
}

export type TGetQuayQueryVariables = Exact<{
    quayId: string
    whitelistedTransportModes?:
        | Array<Types.TTransportMode | null | undefined>
        | Types.TTransportMode
        | null
        | undefined
    whitelistedLines?:
        | Array<string | number>
        | string
        | number
        | null
        | undefined
    numberOfDepartures?: number | null | undefined
    startTime?: DateTime | null | undefined
}>

export type TGetQuayQuery = {
    quay: {
        name: string
        description: string | null
        publicCode: string | null
        estimatedCalls: Array<{
            aimedDepartureTime: DateTime
            expectedDepartureTime: DateTime
            expectedArrivalTime: DateTime
            cancellation: boolean
            realtime: boolean
            quay: { publicCode: string | null; name: string }
            destinationDisplay: {
                frontText: string | null
                via: Array<string | null> | null
            } | null
            serviceJourney: {
                id: string
                transportMode: Types.TTransportMode | null
                transportSubmode: Types.TTransportSubmode | null
                line: {
                    id: string
                    publicCode: string | null
                    presentation: {
                        textColour: string | null
                        colour: string | null
                    } | null
                }
            }
            situations: Array<{
                id: string
                description: Array<{ value: string; language: string | null }>
                summary: Array<{ value: string; language: string | null }>
            }>
        }>
        situations: Array<{
            id: string
            description: Array<{ value: string; language: string | null }>
            summary: Array<{ value: string; language: string | null }>
        }>
        lines: Array<{
            id: string
            publicCode: string | null
            name: string | null
            transportMode: Types.TTransportMode | null
            transportSubmode: Types.TTransportSubmode | null
        }>
    } | null
}

export type TQuayCoordinatesQueryVariables = Exact<{
    id: string
}>

export type TQuayCoordinatesQuery = {
    quay: {
        id: string
        longitude: number | null
        latitude: number | null
    } | null
}

export type TQuayEditQueryVariables = Exact<{
    placeId: string
}>

export type TQuayEditQuery = {
    quay: {
        id: string
        publicCode: string | null
        name: string
        lines: Array<{
            id: string
            publicCode: string | null
            name: string | null
            transportMode: Types.TTransportMode | null
            transportSubmode: Types.TTransportSubmode | null
        }>
    } | null
}

export type TQuayEstimatedCallsQueryVariables = Exact<{
    quayId: string
    numberOfDepartures?: number | null | undefined
    arrivalDeparture?: Types.TArrivalDeparture | null | undefined
}>

export type TQuayEstimatedCallsQuery = {
    quay: {
        estimatedCalls: Array<{
            destinationDisplay: { frontText: string | null } | null
            serviceJourney: { line: { id: string } }
        }>
    } | null
}

export type TQuayNameQueryVariables = Exact<{
    id: string
}>

export type TQuayNameQuery = {
    quay: {
        name: string
        description: string | null
        publicCode: string | null
        id: string
    } | null
}

export type TQuaysSearchQueryVariables = Exact<{
    stopPlaceId: string
}>

export type TQuaysSearchQuery = {
    stopPlace: {
        quays: Array<{
            id: string
            publicCode: string | null
            description: string | null
            stopPlace: {
                transportMode: Array<Types.TTransportMode | null> | null
            } | null
            lines: Array<{
                id: string
                publicCode: string | null
                name: string | null
                transportMode: Types.TTransportMode | null
                transportSubmode: Types.TTransportSubmode | null
            }>
        } | null> | null
    } | null
}

export type TStopPlaceQueryVariables = Exact<{
    stopPlaceId: string
    whitelistedTransportModes?:
        | Array<Types.TTransportMode | null | undefined>
        | Types.TTransportMode
        | null
        | undefined
    whitelistedLines?:
        | Array<string | number>
        | string
        | number
        | null
        | undefined
    numberOfDepartures?: number | null | undefined
    startTime?: DateTime | null | undefined
}>

export type TStopPlaceQuery = {
    stopPlace: {
        name: string
        transportMode: Array<Types.TTransportMode | null> | null
        estimatedCalls: Array<{
            aimedDepartureTime: DateTime
            expectedDepartureTime: DateTime
            expectedArrivalTime: DateTime
            cancellation: boolean
            realtime: boolean
            quay: { publicCode: string | null; name: string }
            destinationDisplay: {
                frontText: string | null
                via: Array<string | null> | null
            } | null
            serviceJourney: {
                id: string
                transportMode: Types.TTransportMode | null
                transportSubmode: Types.TTransportSubmode | null
                line: {
                    id: string
                    publicCode: string | null
                    presentation: {
                        textColour: string | null
                        colour: string | null
                    } | null
                }
            }
            situations: Array<{
                id: string
                description: Array<{ value: string; language: string | null }>
                summary: Array<{ value: string; language: string | null }>
            }>
        }>
        situations: Array<{
            id: string
            description: Array<{ value: string; language: string | null }>
            summary: Array<{ value: string; language: string | null }>
        }>
    } | null
}

export type TStopPlaceCoordinatesQueryVariables = Exact<{
    id: string
}>

export type TStopPlaceCoordinatesQuery = {
    stopPlace: {
        id: string
        longitude: number | null
        latitude: number | null
    } | null
}

export type TStopPlaceEditQueryVariables = Exact<{
    placeId: string
}>

export type TStopPlaceEditQuery = {
    stopPlace: {
        name: string
        quays: Array<{
            id: string
            publicCode: string | null
            name: string
            description: string | null
            stopPlace: {
                transportMode: Array<Types.TTransportMode | null> | null
            } | null
            lines: Array<{
                id: string
                publicCode: string | null
                name: string | null
                transportMode: Types.TTransportMode | null
                transportSubmode: Types.TTransportSubmode | null
            }>
        } | null> | null
    } | null
}

export type TStopPlaceNameQueryVariables = Exact<{
    id: string
}>

export type TStopPlaceNameQuery = {
    stopPlace: { name: string; id: string } | null
}

export type TStopPlacesHaveDeparturesQueryVariables = Exact<{
    ids?: Array<string | null | undefined> | string | null | undefined
}>

export type TStopPlacesHaveDeparturesQuery = {
    stopPlaces: Array<{
        id: string
        quays: Array<{
            lines: Array<{
                transportMode: Types.TTransportMode | null
                transportSubmode: Types.TTransportSubmode | null
            }>
        } | null> | null
    } | null>
}

export type TWalkDistanceQueryVariables = Exact<{
    from: Types.TInputCoordinates
    to: Types.TInputCoordinates
}>

export type TWalkDistanceQuery = {
    trip: {
        tripPatterns: Array<{
            duration: Long | null
            streetDistance: number | null
            legs: Array<{
                expectedStartTime: DateTime
                expectedEndTime: DateTime
                mode: Types.TMode
                distance: number
                line: { id: string; publicCode: string | null } | null
            }>
        }>
    }
}
