/* eslint-disable */
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
    T extends { [key: string]: unknown },
    K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
    | T
    | {
          [P in keyof T]?: P extends ' $fragmentName' | '__typename'
              ? T[P]
              : never
      }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string }
    String: { input: string; output: string }
    Boolean: { input: boolean; output: boolean }
    Int: { input: number; output: number }
    Float: { input: number; output: number }
    Coordinates: { input: Coordinates; output: Coordinates }
    Cost: { input: any; output: any }
    Date: { input: Date; output: Date }
    DateTime: { input: DateTime; output: DateTime }
    DoubleFunction: { input: DoubleFunction; output: DoubleFunction }
    Duration: { input: Duration; output: Duration }
    LocalTime: { input: LocalTime; output: LocalTime }
    Long: { input: Long; output: Long }
    Time: { input: Time; output: Time }
}

export type TAbsoluteDirection =
    | 'east'
    | 'north'
    | 'northeast'
    | 'northwest'
    | 'south'
    | 'southeast'
    | 'southwest'
    | 'west'

export type TAffectedLine = {
    __typename?: 'AffectedLine'
    line: Maybe<TLine>
}

export type TAffectedServiceJourney = {
    __typename?: 'AffectedServiceJourney'
    datedServiceJourney: Maybe<TDatedServiceJourney>
    operatingDay: Maybe<Scalars['Date']['output']>
    serviceJourney: Maybe<TServiceJourney>
}

export type TAffectedStopPlace = {
    __typename?: 'AffectedStopPlace'
    quay: Maybe<TQuay>
    stopConditions: Array<TStopCondition>
    stopPlace: Maybe<TStopPlace>
}

export type TAffectedStopPlaceOnLine = {
    __typename?: 'AffectedStopPlaceOnLine'
    line: Maybe<TLine>
    quay: Maybe<TQuay>
    stopConditions: Array<TStopCondition>
    stopPlace: Maybe<TStopPlace>
}

export type TAffectedStopPlaceOnServiceJourney = {
    __typename?: 'AffectedStopPlaceOnServiceJourney'
    datedServiceJourney: Maybe<TDatedServiceJourney>
    operatingDay: Maybe<Scalars['Date']['output']>
    quay: Maybe<TQuay>
    serviceJourney: Maybe<TServiceJourney>
    stopConditions: Array<TStopCondition>
    stopPlace: Maybe<TStopPlace>
}

export type TAffectedUnknown = {
    __typename?: 'AffectedUnknown'
    description: Maybe<Scalars['String']['output']>
}

export type TAffects =
    | TAffectedLine
    | TAffectedServiceJourney
    | TAffectedStopPlace
    | TAffectedStopPlaceOnLine
    | TAffectedStopPlaceOnServiceJourney
    | TAffectedUnknown

export type TAlternativeLegsFilter =
    | 'noFilter'
    | 'sameAuthority'
    | 'sameLine'
    | 'sameMode'
    /** Must match both subMode and mode */
    | 'sameSubmode'

export type TArrivalDeparture =
    /** Only show arrivals */
    | 'arrivals'
    /** Show both arrivals and departures */
    | 'both'
    /** Only show departures */
    | 'departures'

/** Authority involved in public transportation. An organisation under which the responsibility of organising the transport service in a certain area is placed. */
export type TAuthority = {
    __typename?: 'Authority'
    fareUrl: Maybe<Scalars['String']['output']>
    id: Scalars['ID']['output']
    lang: Maybe<Scalars['String']['output']>
    lines: Array<Maybe<TLine>>
    name: Scalars['String']['output']
    phone: Maybe<Scalars['String']['output']>
    /** Get all situations active for the authority. */
    situations: Array<TPtSituationElement>
    timezone: Scalars['String']['output']
    url: Maybe<Scalars['String']['output']>
}

export type TBicycleOptimisationMethod =
    | 'flat'
    | 'greenways'
    | 'quick'
    | 'safe'
    | 'triangle'

export type TBikePark = TPlaceInterface & {
    __typename?: 'BikePark'
    id: Scalars['ID']['output']
    latitude: Maybe<Scalars['Float']['output']>
    longitude: Maybe<Scalars['Float']['output']>
    name: Scalars['String']['output']
    realtime: Maybe<Scalars['Boolean']['output']>
    spacesAvailable: Maybe<Scalars['Int']['output']>
}

export type TBikeRentalStation = TPlaceInterface & {
    __typename?: 'BikeRentalStation'
    allowDropoff: Maybe<Scalars['Boolean']['output']>
    bikesAvailable: Maybe<Scalars['Int']['output']>
    id: Scalars['ID']['output']
    latitude: Maybe<Scalars['Float']['output']>
    longitude: Maybe<Scalars['Float']['output']>
    name: Scalars['String']['output']
    networks: Array<Maybe<Scalars['String']['output']>>
    realtimeOccupancyAvailable: Maybe<Scalars['Boolean']['output']>
    spacesAvailable: Maybe<Scalars['Int']['output']>
}

export type TBikesAllowed =
    /** The vehicle being used on this particular trip can accommodate at least one bicycle. */
    | 'allowed'
    /** There is no bike information for the trip. */
    | 'noInformation'
    /** No bicycles are allowed on this trip. */
    | 'notAllowed'

export type TBookingArrangement = {
    __typename?: 'BookingArrangement'
    /** Time constraints for booking */
    bookWhen: Maybe<TPurchaseWhen>
    /** Who should ticket be contacted for booking */
    bookingContact: Maybe<TContact>
    /** How should service be booked? */
    bookingMethods: Maybe<Array<Maybe<TBookingMethod>>>
    /** Textual description of booking arrangement for service */
    bookingNote: Maybe<Scalars['String']['output']>
    /** How many days prior to the travel the service needs to be booked */
    latestBookingDay: Maybe<Scalars['Int']['output']>
    /** Latest time the service can be booked. ISO 8601 timestamp */
    latestBookingTime: Maybe<Scalars['LocalTime']['output']>
    /** Minimum period in advance service can be booked as a ISO 8601 duration */
    minimumBookingPeriod: Maybe<Scalars['String']['output']>
}

export type TBookingMethod =
    | 'callDriver'
    | 'callOffice'
    | 'online'
    | 'phoneAtStop'
    | 'text'

export type TBranding = {
    __typename?: 'Branding'
    /** Description of branding. */
    description: Maybe<Scalars['String']['output']>
    id: Maybe<Scalars['ID']['output']>
    /** URL to an image be used for branding */
    image: Maybe<Scalars['String']['output']>
    /** Full name to be used for branding. */
    name: Maybe<Scalars['String']['output']>
    /** Short name to be used for branding. */
    shortName: Maybe<Scalars['String']['output']>
    /** URL to be used for branding */
    url: Maybe<Scalars['String']['output']>
}

export type TContact = {
    __typename?: 'Contact'
    /** Name of person to contact */
    contactPerson: Maybe<Scalars['String']['output']>
    /** Email adress for contact */
    email: Maybe<Scalars['String']['output']>
    /** Textual description of how to get in contact */
    furtherDetails: Maybe<Scalars['String']['output']>
    /** Phone number for contact */
    phone: Maybe<Scalars['String']['output']>
    /** Url for contact */
    url: Maybe<Scalars['String']['output']>
}

/** A planned journey on a specific day */
export type TDatedServiceJourney = {
    __typename?: 'DatedServiceJourney'
    /** Returns scheduled passingTimes for this dated service journey, updated with real-time-updates (if available).  */
    estimatedCalls: Maybe<Array<Maybe<TEstimatedCall>>>
    id: Scalars['ID']['output']
    /** JourneyPattern for the dated service journey. */
    journeyPattern: Maybe<TJourneyPattern>
    /** The date this service runs. The date used is based on the service date as opposed to calendar date. */
    operatingDay: Maybe<Scalars['Date']['output']>
    /** Quays visited by the dated service journey. */
    quays: Array<TQuay>
    /** List of the dated service journeys this dated service journeys replaces */
    replacementFor: Array<TDatedServiceJourney>
    /** The service journey this Dated Service Journey is based on */
    serviceJourney: TServiceJourney
    /** Alterations specified on the Trip in the planned data */
    tripAlteration: Maybe<TServiceAlteration>
}

/** A planned journey on a specific day */
export type TDatedServiceJourneyQuaysArgs = {
    first?: InputMaybe<Scalars['Int']['input']>
    last?: InputMaybe<Scalars['Int']['input']>
}

/** An advertised destination of a specific journey pattern, usually displayed on a head sign or at other on-board locations. */
export type TDestinationDisplay = {
    __typename?: 'DestinationDisplay'
    /** Name of destination to show on front of vehicle. */
    frontText: Maybe<Scalars['String']['output']>
    /** Intermediary destinations which the vehicle will pass before reaching its final destination. */
    via: Maybe<Array<Maybe<Scalars['String']['output']>>>
}

export type TDirectionType =
    | 'anticlockwise'
    | 'clockwise'
    | 'inbound'
    | 'outbound'
    | 'unknown'

/** Individual step of an elevation profile. */
export type TElevationProfileStep = {
    __typename?: 'ElevationProfileStep'
    /** The horizontal distance from the start of the step, in meters. */
    distance: Maybe<Scalars['Float']['output']>
    /**
     * The elevation at this distance, in meters above sea level. It is negative if the
     * location is below sea level.
     *
     */
    elevation: Maybe<Scalars['Float']['output']>
}

/** List of visits to quays as part of vehicle journeys. Updated with real time information where available */
export type TEstimatedCall = {
    __typename?: 'EstimatedCall'
    /** Actual time of arrival at quay. Updated from real time information if available. */
    actualArrivalTime: Maybe<Scalars['DateTime']['output']>
    /** Actual time of departure from quay. Updated with real time information if available. */
    actualDepartureTime: Maybe<Scalars['DateTime']['output']>
    /** Scheduled time of arrival at quay. Not affected by read time updated */
    aimedArrivalTime: Scalars['DateTime']['output']
    /** Scheduled time of departure from quay. Not affected by read time updated */
    aimedDepartureTime: Scalars['DateTime']['output']
    /** Booking arrangements for this EstimatedCall. */
    bookingArrangements: Maybe<TBookingArrangement>
    /** Whether stop is cancelled. This means that either the ServiceJourney has a planned cancellation, the ServiceJourney has been cancelled by real-time data, or this particular StopPoint has been cancelled. This also means that both boarding and alighting has been cancelled. */
    cancellation: Scalars['Boolean']['output']
    /** The date the estimated call is valid for. */
    date: Scalars['Date']['output']
    datedServiceJourney: Maybe<TDatedServiceJourney>
    destinationDisplay: Maybe<TDestinationDisplay>
    /** Expected time of arrival at quay. Updated with real time information if available. Will be null if an actualArrivalTime exists */
    expectedArrivalTime: Scalars['DateTime']['output']
    /** Expected time of departure from quay. Updated with real time information if available. Will be null if an actualDepartureTime exists */
    expectedDepartureTime: Scalars['DateTime']['output']
    /** Whether vehicle may be alighted at quay. */
    forAlighting: Scalars['Boolean']['output']
    /** Whether vehicle may be boarded at quay. */
    forBoarding: Scalars['Boolean']['output']
    notices: Array<TNotice>
    occupancyStatus: TOccupancyStatus
    /** Whether the updated estimates are expected to be inaccurate. */
    predictionInaccurate: Scalars['Boolean']['output']
    quay: TQuay
    /** Whether this call has been updated with real time information. */
    realtime: Scalars['Boolean']['output']
    realtimeState: TRealtimeState
    /** Whether vehicle will only stop on request. */
    requestStop: Scalars['Boolean']['output']
    serviceJourney: TServiceJourney
    /** Get all relevant situations for this EstimatedCall. */
    situations: Array<TPtSituationElement>
    stopPositionInPattern: Scalars['Int']['output']
    /** Whether this is a timing point or not. Boarding and alighting is not allowed at timing points. */
    timingPoint: Scalars['Boolean']['output']
}

export type TFilterPlaceType =
    /** Bicycle rent stations */
    | 'bicycleRent'
    /** Bike parks */
    | 'bikePark'
    /** Car parks */
    | 'carPark'
    /** Quay */
    | 'quay'
    /** StopPlace */
    | 'stopPlace'

/** Additional (optional) grouping of lines for particular purposes such as e.g. fare harmonisation or public presentation. */
export type TGroupOfLines = {
    __typename?: 'GroupOfLines'
    /** Description of group of lines */
    description: Maybe<Scalars['String']['output']>
    id: Scalars['ID']['output']
    /** All lines part of this group of lines */
    lines: Array<TLine>
    /** Full name for group of lines. */
    name: Maybe<Scalars['String']['output']>
    /** For internal use by operator/authority. */
    privateCode: Maybe<Scalars['String']['output']>
    /** Short name for group of lines. */
    shortName: Maybe<Scalars['String']['output']>
}

/** Filter trips by disallowing lines involving certain elements. If both lines and authorities are specified, only one must be valid for each line to be banned. If a line is both banned and whitelisted, it will be counted as banned. */
export type TInputBanned = {
    /** Set of ids for authorities that should not be used */
    authorities?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>
    /** Set of ids for lines that should not be used */
    lines?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>
    /** NOT IMPLEMENTED. Set of ids of quays that should not be allowed for boarding or alighting. Trip patterns that travel through the quay will still be permitted. */
    quays?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>
    /** NOT IMPLEMENTED. Set of ids of quays that should not be allowed for boarding, alighting or traveling thorugh. */
    quaysHard?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>
    /** Set of ids of rental networks that should not be allowed for renting vehicles. */
    rentalNetworks?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>
    /** Set of ids of service journeys that should not be used. */
    serviceJourneys?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>
}

/** Input type for coordinates in the WGS84 system */
export type TInputCoordinates = {
    /** The latitude of the place. */
    latitude: Scalars['Float']['input']
    /** The longitude of the place. */
    longitude: Scalars['Float']['input']
}

export type TInputField = 'dateTime' | 'from' | 'intermediatePlace' | 'to'

export type TInputPlaceIds = {
    /** Bike parks to include by id. */
    bikeParks?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
    /** Bike rentals to include by id. */
    bikeRentalStations?: InputMaybe<
        Array<InputMaybe<Scalars['String']['input']>>
    >
    /** Car parks to include by id. */
    carParks?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
    /** Lines to include by id. */
    lines?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
    /** Quays to include by id. */
    quays?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
}

/** Filter trips by only allowing lines involving certain elements. If both lines and authorities are specified, only one must be valid for each line to be used. If a line is both banned and whitelisted, it will be counted as banned. */
export type TInputWhiteListed = {
    /** Set of ids for authorities that should be used */
    authorities?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>
    /** Set of ids for lines that should be used */
    lines?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>
    /** Set of ids of rental networks that should be used for renting vehicles. */
    rentalNetworks?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>
}

export type TInterchange = {
    __typename?: 'Interchange'
    /** @deprecated This is the same as using the `fromServiceJourney { line }` field. */
    FromLine: Maybe<TLine>
    /** @deprecated Use fromServiceJourney instead */
    FromServiceJourney: Maybe<TServiceJourney>
    /** @deprecated This is the same as using the `toServiceJourney { line }` field. */
    ToLine: Maybe<TLine>
    /** @deprecated Use toServiceJourney instead */
    ToServiceJourney: Maybe<TServiceJourney>
    fromServiceJourney: Maybe<TServiceJourney>
    guaranteed: Maybe<Scalars['Boolean']['output']>
    /** Maximum time after scheduled departure time the connecting transport is guaranteed to wait for the delayed trip. [NOT RESPECTED DURING ROUTING, JUST PASSED THROUGH] */
    maximumWaitTime: Maybe<Scalars['Int']['output']>
    /** The transfer priority is used to decide where a transfer should happen, at the highest prioritized location. If the guaranteed flag is set it take precedence priority. A guaranteed ALLOWED transfer is preferred over a PREFERRED none-guaranteed transfer. */
    priority: Maybe<TInterchangePriority>
    staySeated: Maybe<Scalars['Boolean']['output']>
    toServiceJourney: Maybe<TServiceJourney>
}

export type TInterchangePriority =
    | 'allowed'
    | 'notAllowed'
    | 'preferred'
    | 'recommended'

export type TInterchangeWeighting =
    /** Third highest priority interchange. */
    | 'interchangeAllowed'
    /** Interchange not allowed. */
    | 'noInterchange'
    /** Highest priority interchange. */
    | 'preferredInterchange'
    /** Second highest priority interchange. */
    | 'recommendedInterchange'

/**
 * Enable this to attach a system notice to itineraries instead of removing them. This is very
 * convenient when tuning the itinerary-filter-chain.
 */
export type TItineraryFilterDebugProfile =
    /**
     * Only return the requested number of itineraries, counting both actual and deleted ones.
     * The top `numItineraries` using the request sort order is returned. This does not work
     * with paging, itineraries after the limit, but inside the search-window are skipped when
     * moving to the next page.
     */
    | 'limitToNumOfItineraries'
    /**
     * Return all itineraries, including deleted ones, inside the actual search-window used
     * (the requested search-window may differ).
     */
    | 'limitToSearchWindow'
    /** List all itineraries, including all deleted itineraries. */
    | 'listAll'
    /** By default, the debug itinerary filters is turned off. */
    | 'off'

/** Parameters for the OTP Itinerary Filter Chain. These parameters SHOULD be configured on the server side and should not be used by the client. They are made available here to be able to experiment and tune the server. */
export type TItineraryFilters = {
    /**
     * Use this parameter to debug the itinerary-filter-chain. The default is `off`
     * (itineraries are filtered and not returned). For all other values the unwanted
     * itineraries are returned with a system notice, and not deleted.
     */
    debug?: InputMaybe<TItineraryFilterDebugProfile>
    /** Pick ONE itinerary from each group after putting itineraries that is 85% similar together. */
    groupSimilarityKeepOne?: InputMaybe<Scalars['Float']['input']>
    /** Reduce the number of itineraries in each group to to maximum 3 itineraries. The itineraries are grouped by similar legs (on board same journey). So, if  68% of the distance is traveled by similar legs, then two itineraries are in the same group. Default value is 68%, must be at least 50%. */
    groupSimilarityKeepThree?: InputMaybe<Scalars['Float']['input']>
    /** Of the itineraries grouped to maximum of three itineraries, how much worse can the non-grouped legs be compared to the lowest cost. 2.0 means that they can be double the cost, and any itineraries having a higher cost will be filtered. Default value is 2.0, use a value lower than 1.0 to turn off */
    groupedOtherThanSameLegsMaxCostMultiplier?: InputMaybe<
        Scalars['Float']['input']
    >
    /** Set a relative limit for all transit itineraries. The limit is calculated based on the transit itinerary generalized-cost and the time between itineraries Itineraries without transit legs are excluded from this filter. Example: costLimitFunction(x) = 3600 + 2.0 x and intervalRelaxFactor = 0.5. If the lowest cost returned is 10 000, then the limit is set to: 3 600 + 2 * 10 000 = 26 600 plus half of the time between either departure or arrival times of the itinerary. Default: {"costLimitFunction": 15m + 1.50 t, "intervalRelaxFactor": 0.75} */
    transitGeneralizedCostLimit?: InputMaybe<TTransitGeneralizedCostFilterParams>
}

export type TJourneyPattern = {
    __typename?: 'JourneyPattern'
    directionType: Maybe<TDirectionType>
    id: Scalars['ID']['output']
    line: TLine
    name: Maybe<Scalars['String']['output']>
    notices: Array<TNotice>
    pointsOnLink: Maybe<TPointsOnLink>
    /** Quays visited by service journeys for this journey patterns */
    quays: Array<TQuay>
    serviceJourneys: Array<TServiceJourney>
    /** List of service journeys for the journey pattern for a given date */
    serviceJourneysForDate: Array<TServiceJourney>
    /** Get all situations active for the journey pattern. */
    situations: Array<TPtSituationElement>
    /** Detailed path travelled by journey pattern divided into stop-to-stop sections. */
    stopToStopGeometries: Maybe<Array<Maybe<TStopToStopGeometry>>>
}

export type TJourneyPatternServiceJourneysForDateArgs = {
    date?: InputMaybe<Scalars['Date']['input']>
}

/** Part of a trip pattern. Either a ride on a public transport vehicle or access or path link to/from/between places */
export type TLeg = {
    __typename?: 'Leg'
    /** The aimed date and time this leg ends. */
    aimedEndTime: Scalars['DateTime']['output']
    /** The aimed date and time this leg starts. */
    aimedStartTime: Scalars['DateTime']['output']
    /** For ride legs, the service authority used for this legs. For non-ride legs, null. */
    authority: Maybe<TAuthority>
    bikeRentalNetworks: Array<Maybe<Scalars['String']['output']>>
    bookingArrangements: Maybe<TBookingArrangement>
    /** The dated service journey used for this leg. */
    datedServiceJourney: Maybe<TDatedServiceJourney>
    /** NOT IMPLEMENTED */
    directDuration: Scalars['Long']['output']
    /** The distance traveled while traversing the leg in meters. */
    distance: Scalars['Float']['output']
    /** The leg's duration in seconds */
    duration: Scalars['Long']['output']
    /**
     * The leg's elevation profile. All elevation values, including the first one, are in meters
     * above sea level. The elevation is negative for places below sea level. The profile
     * includes both the start and end coordinate.
     *
     */
    elevationProfile: Array<Maybe<TElevationProfileStep>>
    /** The expected, real-time adjusted date and time this leg ends. */
    expectedEndTime: Scalars['DateTime']['output']
    /** The expected, real-time adjusted date and time this leg starts. */
    expectedStartTime: Scalars['DateTime']['output']
    /** EstimatedCall for the quay where the leg originates. */
    fromEstimatedCall: Maybe<TEstimatedCall>
    /** The Place where the leg originates. */
    fromPlace: TPlace
    /** Generalized cost or weight of the leg. Used for debugging. */
    generalizedCost: Maybe<Scalars['Int']['output']>
    /** An identifier for the leg, which can be used to re-fetch the information. */
    id: Maybe<Scalars['ID']['output']>
    interchangeFrom: Maybe<TInterchange>
    interchangeTo: Maybe<TInterchange>
    /** For ride legs, estimated calls for quays between the Place where the leg originates and the Place where the leg ends. For non-ride legs, empty list. */
    intermediateEstimatedCalls: Array<TEstimatedCall>
    /** For ride legs, intermediate quays between the Place where the leg originates and the Place where the leg ends. For non-ride legs, empty list. */
    intermediateQuays: Array<TQuay>
    /** For ride legs, the line. For non-ride legs, null. */
    line: Maybe<TLine>
    /** The mode of transport or access (e.g., foot) used when traversing this leg. */
    mode: TMode
    /** Fetch the next legs, which can be used to replace this leg. The replacement legs do arrive/depart from/to the same stop places. It might be necessary to change other legs in an itinerary in order to be able to ride the returned legs. */
    nextLegs: Maybe<Array<TLeg>>
    /** For ride legs, the operator used for this legs. For non-ride legs, null. */
    operator: Maybe<TOperator>
    /** The leg's geometry. */
    pointsOnLink: Maybe<TPointsOnLink>
    /** Fetch the previous legs, which can be used to replace this leg. The replacement legs do arrive/depart from/to the same stop places. It might be necessary to change other legs in an itinerary in order to be able to ride the returned legs. */
    previousLegs: Maybe<Array<TLeg>>
    /** Whether there is real-time data about this leg */
    realtime: Scalars['Boolean']['output']
    /** Whether this leg is with a rented bike. */
    rentedBike: Maybe<Scalars['Boolean']['output']>
    /** Whether this leg is a ride leg or not. */
    ride: Scalars['Boolean']['output']
    /** For transit legs, the service date of the trip. For non-transit legs, null. */
    serviceDate: Maybe<Scalars['Date']['output']>
    /** For ride legs, the service journey. For non-ride legs, null. */
    serviceJourney: Maybe<TServiceJourney>
    /** For ride legs, all estimated calls for the service journey. For non-ride legs, empty list. */
    serviceJourneyEstimatedCalls: Array<TEstimatedCall>
    /** All relevant situations for this leg */
    situations: Array<TPtSituationElement>
    /** Do we continue from a specified via place */
    steps: Array<Maybe<TPathGuidance>>
    /** EstimatedCall for the quay where the leg ends. */
    toEstimatedCall: Maybe<TEstimatedCall>
    /** The Place where the leg ends. */
    toPlace: TPlace
    /** The transport sub mode (e.g., localBus or expressBus) used when traversing this leg. Null if leg is not a ride */
    transportSubmode: Maybe<TTransportSubmode>
    /** Whether this leg is walking with a bike. */
    walkingBike: Maybe<Scalars['Boolean']['output']>
}

/** Part of a trip pattern. Either a ride on a public transport vehicle or access or path link to/from/between places */
export type TLegNextLegsArgs = {
    filter?: InputMaybe<TAlternativeLegsFilter>
    next?: InputMaybe<Scalars['Int']['input']>
}

/** Part of a trip pattern. Either a ride on a public transport vehicle or access or path link to/from/between places */
export type TLegPreviousLegsArgs = {
    filter?: InputMaybe<TAlternativeLegsFilter>
    previous?: InputMaybe<Scalars['Int']['input']>
}

/** A group of routes which is generally known to the public by a similar name or number */
export type TLine = {
    __typename?: 'Line'
    authority: Maybe<TAuthority>
    bikesAllowed: Maybe<TBikesAllowed>
    /**
     * Booking arrangements for flexible line.
     * @deprecated BookingArrangements are defined per stop, and can be found under `passingTimes` or `estimatedCalls`
     */
    bookingArrangements: Maybe<TBookingArrangement>
    branding: Maybe<TBranding>
    description: Maybe<Scalars['String']['output']>
    /** Type of flexible line, or null if line is not flexible. */
    flexibleLineType: Maybe<Scalars['String']['output']>
    /** Groups of lines that line is a part of. */
    groupOfLines: Array<Maybe<TGroupOfLines>>
    id: Scalars['ID']['output']
    journeyPatterns: Maybe<Array<Maybe<TJourneyPattern>>>
    name: Maybe<Scalars['String']['output']>
    notices: Array<TNotice>
    operator: Maybe<TOperator>
    presentation: Maybe<TPresentation>
    /** Publicly announced code for line, differentiating it from other lines for the same operator. */
    publicCode: Maybe<Scalars['String']['output']>
    quays: Array<Maybe<TQuay>>
    serviceJourneys: Array<Maybe<TServiceJourney>>
    /** Get all situations active for the line. */
    situations: Array<TPtSituationElement>
    transportMode: Maybe<TTransportMode>
    transportSubmode: Maybe<TTransportSubmode>
    url: Maybe<Scalars['String']['output']>
}

export type TLocale = 'no' | 'us'

/** Input format for specifying a location through either a place reference (id), coordinates or both. If both place and coordinates are provided the place ref will be used if found, coordinates will only be used if place is not known. */
export type TLocation = {
    /** Coordinates for the location. This can be used alone or as fallback if the place id is not found. */
    coordinates?: InputMaybe<TInputCoordinates>
    /** The name of the location. This is pass-through informationand is not used in routing. */
    name?: InputMaybe<Scalars['String']['input']>
    /** The id of an element in the OTP model. Currently supports Quay, StopPlace, multimodal StopPlace, and GroupOfStopPlaces. */
    place?: InputMaybe<Scalars['String']['input']>
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

/** Input format for specifying which modes will be allowed for this search. If this element is not present, it will default to accessMode/egressMode/directMode of foot and all transport modes will be allowed. */
export type TModes = {
    /** The mode used to get from the origin to the access stops in the transit network the transit network (first-mile). If the element is not present or null,only transit that can be immediately boarded from the origin will be used. */
    accessMode?: InputMaybe<TStreetMode>
    /** The mode used to get from the origin to the destination directly, without using the transit network. If the element is not present or null,direct travel without using transit will be disallowed. */
    directMode?: InputMaybe<TStreetMode>
    /** The mode used to get from the egress stops in the transit network tothe destination (last-mile). If the element is not present or null,only transit that can immediately arrive at the origin will be used. */
    egressMode?: InputMaybe<TStreetMode>
    /** The allowed modes for the transit part of the trip. Use an empty list to disallow transit for this search. If the element is not present or null, it will default to all transport modes. */
    transportModes?: InputMaybe<Array<InputMaybe<TTransportModes>>>
}

export type TMultiModalMode =
    /** Both multiModal parents and their mono modal child stop places. */
    | 'all'
    /** Only mono modal children stop places, not their multi modal parent stop */
    | 'child'
    /** Multi modal parent stop places without their mono modal children. */
    | 'parent'

/** Text with language */
export type TMultilingualString = {
    __typename?: 'MultilingualString'
    language: Maybe<Scalars['String']['output']>
    value: Scalars['String']['output']
}

export type TNotice = {
    __typename?: 'Notice'
    id: Scalars['ID']['output']
    publicCode: Maybe<Scalars['String']['output']>
    text: Maybe<Scalars['String']['output']>
}

/** OccupancyStatus to be exposed in the API. The values are based on GTFS-RT */
export type TOccupancyStatus =
    /**
     * The vehicle or carriage can currently accommodate only standing passengers and has limited
     * space for them. There isn't a big difference between this and `full` so it's possible to
     * handle them as the same value, if one wants to limit the number of different values.
     * SIRI nordic profile: merge into `standingRoomOnly`.
     *
     */
    | 'crushedStandingRoomOnly'
    /**
     * The vehicle is considered empty by most measures, and has few or no passengers onboard, but is
     * still accepting passengers. There isn't a big difference between this and `manySeatsAvailable`
     * so it's possible to handle them as the same value, if one wants to limit the number of different
     * values.
     * SIRI nordic profile: merge these into `manySeatsAvailable`.
     *
     */
    | 'empty'
    /**
     * The vehicle or carriage has a few seats available.
     * SIRI nordic profile: less than ~50% of seats available.
     *
     */
    | 'fewSeatsAvailable'
    /**
     * The vehicle or carriage is considered full by most measures, but may still be allowing
     * passengers to board.
     *
     */
    | 'full'
    /**
     * The vehicle or carriage has a large number of seats available.
     * SIRI nordic profile: more than ~50% of seats available.
     *
     */
    | 'manySeatsAvailable'
    /** The vehicle or carriage doesn't have any occupancy data available. */
    | 'noData'
    /**
     * The vehicle or carriage has no seats or standing room available.
     * SIRI nordic profile: if vehicle/carriage is not in use / unavailable, or passengers are only
     * allowed to alight due to e.g. crowding.
     *
     */
    | 'notAcceptingPassengers'
    /**
     * The vehicle or carriage only has standing room available.
     * SIRI nordic profile: less than ~10% of seats available.
     *
     */
    | 'standingRoomOnly'

/** Organisation providing public transport services. */
export type TOperator = {
    __typename?: 'Operator'
    id: Scalars['ID']['output']
    lines: Array<Maybe<TLine>>
    name: Scalars['String']['output']
    phone: Maybe<Scalars['String']['output']>
    serviceJourney: Array<Maybe<TServiceJourney>>
    url: Maybe<Scalars['String']['output']>
}

/** Information about pagination in a connection. */
export type TPageInfo = {
    __typename?: 'PageInfo'
    /** When paginating forwards, the cursor to continue. */
    endCursor: Maybe<Scalars['String']['output']>
    /** When paginating forwards, are there more items? */
    hasNextPage: Scalars['Boolean']['output']
    /** When paginating backwards, are there more items? */
    hasPreviousPage: Scalars['Boolean']['output']
    /** When paginating backwards, the cursor to continue. */
    startCursor: Maybe<Scalars['String']['output']>
}

/** Defines one point which the journey must pass through. */
export type TPassThroughPoint = {
    /** Optional name of the pass-through point for debugging and logging. It is not used in routing. */
    name?: InputMaybe<Scalars['String']['input']>
    /**
     * The list of *stop location ids* which define the pass-through point. At least one id is required.
     * Quay, StopPlace, multimodal StopPlace, and GroupOfStopPlaces are supported location types.
     * The journey must pass through at least one of these entities - not all of them.
     */
    placeIds?: InputMaybe<Array<Scalars['String']['input']>>
}

/** A series of turn by turn instructions used for walking, biking and driving. */
export type TPathGuidance = {
    __typename?: 'PathGuidance'
    /** This step is on an open area, such as a plaza or train platform, and thus the directions should say something like "cross" */
    area: Maybe<Scalars['Boolean']['output']>
    /** The name of this street was generated by the system, so we should only display it once, and generally just display right/left directions */
    bogusName: Maybe<Scalars['Boolean']['output']>
    /** The distance in meters that this step takes. */
    distance: Maybe<Scalars['Float']['output']>
    /**
     * The step's elevation profile. All elevation values, including the first one, are in meters
     * above sea level. The elevation is negative for places below sea level. The profile
     * includes both the start and end coordinate.
     *
     */
    elevationProfile: Array<Maybe<TElevationProfileStep>>
    /** When exiting a highway or traffic circle, the exit name/number. */
    exit: Maybe<Scalars['String']['output']>
    /** The absolute direction of this step. */
    heading: Maybe<TAbsoluteDirection>
    /** The latitude of the step. */
    latitude: Maybe<Scalars['Float']['output']>
    /** The longitude of the step. */
    longitude: Maybe<Scalars['Float']['output']>
    /** The relative direction of this step. */
    relativeDirection: Maybe<TRelativeDirection>
    /** Indicates whether or not a street changes direction at an intersection. */
    stayOn: Maybe<Scalars['Boolean']['output']>
    /** The name of the street. */
    streetName: Maybe<Scalars['String']['output']>
}

/** A combination of street mode and penalty for time and cost. */
export type TPenaltyForStreetMode = {
    /**
     *     This is used to take the time-penalty and multiply by the `costFactor`.
     *     The result is added to the generalized-cost.
     *
     */
    costFactor?: InputMaybe<Scalars['Float']['input']>
    /**
     * List of modes with the given penalty is applied to. A street-mode should not be listed
     * in more than one element. If empty or null the penalty is applied to all unlisted modes,
     * it becomes the default penalty for this query.
     *
     */
    streetMode: TStreetMode
    /**
     * Penalty applied to the time for the given list of modes.
     *
     */
    timePenalty: Scalars['DoubleFunction']['input']
}

/** Common super class for all places (stop places, quays, car parks, bike parks and bike rental stations ) */
export type TPlace = {
    __typename?: 'Place'
    /** The bike rental station related to the place */
    bikeRentalStation: Maybe<TBikeRentalStation>
    /** The flexible area related to the place. */
    flexibleArea: Maybe<Scalars['Coordinates']['output']>
    /** The latitude of the place. */
    latitude: Scalars['Float']['output']
    /** The longitude of the place. */
    longitude: Scalars['Float']['output']
    /** For transit quays, the name of the quay. For points of interest, the name of the POI. */
    name: Maybe<Scalars['String']['output']>
    /** The quay related to the place. */
    quay: Maybe<TQuay>
    /** The rental vehicle related to the place */
    rentalVehicle: Maybe<TRentalVehicle>
    /** Type of vertex. (Normal, Bike sharing station, Bike P+R, Transit quay) Mostly used for better localization of bike sharing and P+R station names */
    vertexType: Maybe<TVertexType>
}

export type TPlaceAtDistance = {
    __typename?: 'PlaceAtDistance'
    distance: Maybe<Scalars['Float']['output']>
    /** @deprecated Id is not referable or meaningful and will be removed */
    id: Scalars['ID']['output']
    place: Maybe<TPlaceInterface>
}

/** Interface for places, i.e. quays, stop places, parks */
export type TPlaceInterface = {
    id: Scalars['ID']['output']
    latitude: Maybe<Scalars['Float']['output']>
    longitude: Maybe<Scalars['Float']['output']>
}

/** A list of coordinates encoded as a polyline string (see http://code.google.com/apis/maps/documentation/polylinealgorithm.html) */
export type TPointsOnLink = {
    __typename?: 'PointsOnLink'
    /** The number of points in the string */
    length: Maybe<Scalars['Int']['output']>
    /** The encoded points of the polyline. Be aware that the string could contain escape characters that need to be accounted for. (https://www.freeformatter.com/javascript-escape.html) */
    points: Maybe<Scalars['String']['output']>
}

/** Types describing common presentation properties */
export type TPresentation = {
    __typename?: 'Presentation'
    colour: Maybe<Scalars['String']['output']>
    textColour: Maybe<Scalars['String']['output']>
}

/** Simple public transport situation element */
export type TPtSituationElement = {
    __typename?: 'PtSituationElement'
    /** Advice of situation in all different translations available */
    advice: Array<TMultilingualString>
    /** Get all affected entities for the situation */
    affects: Array<TAffects>
    /**
     * Get affected authority for this situation element
     * @deprecated Use affects instead
     */
    authority: Maybe<TAuthority>
    /** Timestamp for when the situation was created. */
    creationTime: Maybe<Scalars['DateTime']['output']>
    /** Description of situation in all different translations available */
    description: Array<TMultilingualString>
    id: Scalars['ID']['output']
    /** Optional links to more information. */
    infoLinks: Maybe<Array<TInfoLink>>
    /** @deprecated Use affects instead */
    lines: Array<Maybe<TLine>>
    /** Codespace of the data source. */
    participant: Maybe<Scalars['String']['output']>
    /** Priority of this situation  */
    priority: Maybe<Scalars['Int']['output']>
    /** @deprecated Use affects instead */
    quays: Array<TQuay>
    /**
     * Authority that reported this situation. Always returns the first agency in the codespace
     * @deprecated Not yet officially supported. May be removed or renamed.
     */
    reportAuthority: Maybe<TAuthority>
    /** ReportType of this situation */
    reportType: Maybe<TReportType>
    /** @deprecated Use affects instead */
    serviceJourneys: Array<Maybe<TServiceJourney>>
    /** Severity of this situation  */
    severity: Maybe<TSeverity>
    /** Operator's internal id for this situation */
    situationNumber: Maybe<Scalars['String']['output']>
    /** @deprecated Use affects instead */
    stopPlaces: Array<TStopPlace>
    /** Summary of situation in all different translations available */
    summary: Array<TMultilingualString>
    /** Period this situation is in effect */
    validityPeriod: Maybe<TValidityPeriod>
    /** Operator's version number for the situation element. */
    version: Maybe<Scalars['Int']['output']>
    /** Timestamp when the situation element was updated. */
    versionedAtTime: Maybe<Scalars['DateTime']['output']>
}

export type TPurchaseWhen =
    | 'advanceAndDayOfTravel'
    | 'dayOfTravelOnly'
    | 'other'
    | 'timeOfTravelOnly'
    | 'untilPreviousDay'

/** A place such as platform, stance, or quayside where passengers have access to PT vehicles. */
export type TQuay = TPlaceInterface & {
    __typename?: 'Quay'
    description: Maybe<Scalars['String']['output']>
    /** List of visits to this quay as part of vehicle journeys. */
    estimatedCalls: Array<TEstimatedCall>
    /** Geometry for flexible area. */
    flexibleArea: Maybe<Scalars['Coordinates']['output']>
    /** the Quays part of a flexible group. */
    flexibleGroup: Maybe<Array<Maybe<TQuay>>>
    id: Scalars['ID']['output']
    /** List of journey patterns servicing this quay */
    journeyPatterns: Array<Maybe<TJourneyPattern>>
    latitude: Maybe<Scalars['Float']['output']>
    /** List of lines servicing this quay */
    lines: Array<TLine>
    longitude: Maybe<Scalars['Float']['output']>
    name: Scalars['String']['output']
    /** Public code used to identify this quay within the stop place. For instance a platform code. */
    publicCode: Maybe<Scalars['String']['output']>
    /** Get all situations active for the quay. */
    situations: Array<TPtSituationElement>
    /** The stop place to which this quay belongs to. */
    stopPlace: Maybe<TStopPlace>
    stopType: Maybe<Scalars['String']['output']>
    tariffZones: Array<Maybe<TTariffZone>>
    timeZone: Maybe<Scalars['String']['output']>
    /** Whether this quay is suitable for wheelchair boarding. */
    wheelchairAccessible: Maybe<TWheelchairBoarding>
}

/** A place such as platform, stance, or quayside where passengers have access to PT vehicles. */
export type TQuayEstimatedCallsArgs = {
    arrivalDeparture?: InputMaybe<TArrivalDeparture>
    includeCancelledTrips?: InputMaybe<Scalars['Boolean']['input']>
    numberOfDepartures?: InputMaybe<Scalars['Int']['input']>
    numberOfDeparturesPerLineAndDestinationDisplay?: InputMaybe<
        Scalars['Int']['input']
    >
    startTime?: InputMaybe<Scalars['DateTime']['input']>
    timeRange?: InputMaybe<Scalars['Int']['input']>
    whiteListed?: InputMaybe<TInputWhiteListed>
    whiteListedModes?: InputMaybe<Array<InputMaybe<TTransportMode>>>
}

/** A place such as platform, stance, or quayside where passengers have access to PT vehicles. */
export type TQuayNameArgs = {
    language?: InputMaybe<Scalars['String']['input']>
}

export type TQuayAtDistance = {
    __typename?: 'QuayAtDistance'
    /** The distance in meters to the given quay. */
    distance: Maybe<Scalars['Float']['output']>
    id: Scalars['ID']['output']
    quay: Maybe<TQuay>
}

export type TQueryType = {
    __typename?: 'QueryType'
    /** Get all authorities */
    authorities: Array<Maybe<TAuthority>>
    /** Get an authority by ID */
    authority: Maybe<TAuthority>
    /** Get a single bike park based on its id */
    bikePark: Maybe<TBikePark>
    /** Get all bike parks */
    bikeParks: Array<Maybe<TBikePark>>
    /** Get all bike rental stations */
    bikeRentalStation: Maybe<TBikeRentalStation>
    /** Get all bike rental stations */
    bikeRentalStations: Array<Maybe<TBikeRentalStation>>
    /** Get all bike rental stations within the specified bounding box. */
    bikeRentalStationsByBbox: Array<Maybe<TBikeRentalStation>>
    /** Get a single dated service journey based on its id */
    datedServiceJourney: Maybe<TDatedServiceJourney>
    /** Get all dated service journeys, matching the filters */
    datedServiceJourneys: Array<TDatedServiceJourney>
    /** Get a single group of lines based on its id */
    groupOfLines: Maybe<TGroupOfLines>
    /** Get all groups of lines */
    groupsOfLines: Array<TGroupOfLines>
    /** Refetch a single leg based on its id */
    leg: Maybe<TLeg>
    /** Get a single line based on its id */
    line: Maybe<TLine>
    /** Get all lines */
    lines: Array<Maybe<TLine>>
    /** Get all places (quays, stop places, car parks etc. with coordinates) within the specified radius from a location. The returned type has two fields place and distance. The search is done by walking so the distance is according to the network of walkables. */
    nearest: Maybe<TPlaceAtDistanceConnection>
    /** Get a operator by ID */
    operator: Maybe<TOperator>
    /** Get all operators */
    operators: Array<Maybe<TOperator>>
    /** Get a single quay based on its id) */
    quay: Maybe<TQuay>
    /** Get all quays */
    quays: Array<Maybe<TQuay>>
    /** Get all quays within the specified bounding box */
    quaysByBbox: Array<Maybe<TQuay>>
    /** Get all quays within the specified walking radius from a location. There are no maximum limits for the input parameters, but the query will timeout and return if the parameters are too high. */
    quaysByRadius: Maybe<TQuayAtDistanceConnection>
    /** Get default routing parameters. */
    routingParameters: Maybe<TRoutingParameters>
    /** Get OTP server information */
    serverInfo: TServerInfo
    /** Get a single service journey based on its id */
    serviceJourney: Maybe<TServiceJourney>
    /** Get all service journeys */
    serviceJourneys: Array<Maybe<TServiceJourney>>
    /** Get a single situation based on its situationNumber */
    situation: Maybe<TPtSituationElement>
    /** Get all active situations. */
    situations: Array<TPtSituationElement>
    /** Get a single stopPlace based on its id) */
    stopPlace: Maybe<TStopPlace>
    /** Get all stopPlaces */
    stopPlaces: Array<Maybe<TStopPlace>>
    /** Get all stop places within the specified bounding box */
    stopPlacesByBbox: Array<Maybe<TStopPlace>>
    /** Input type for executing a travel search for a trip between two locations. Returns trip patterns describing suggested alternatives for the trip. */
    trip: TTrip
    /** Via trip search. Find trip patterns traveling via one or more intermediate (via) locations. */
    viaTrip: TViaTrip
}

export type TQueryTypeAuthorityArgs = {
    id: Scalars['String']['input']
}

export type TQueryTypeBikeParkArgs = {
    id: Scalars['String']['input']
}

export type TQueryTypeBikeRentalStationArgs = {
    id: Scalars['String']['input']
}

export type TQueryTypeBikeRentalStationsArgs = {
    ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
}

export type TQueryTypeBikeRentalStationsByBboxArgs = {
    maximumLatitude?: InputMaybe<Scalars['Float']['input']>
    maximumLongitude?: InputMaybe<Scalars['Float']['input']>
    minimumLatitude?: InputMaybe<Scalars['Float']['input']>
    minimumLongitude?: InputMaybe<Scalars['Float']['input']>
}

export type TQueryTypeDatedServiceJourneyArgs = {
    id?: InputMaybe<Scalars['String']['input']>
}

export type TQueryTypeDatedServiceJourneysArgs = {
    alterations?: InputMaybe<Array<TServiceAlteration>>
    authorities?: InputMaybe<Array<Scalars['String']['input']>>
    lines?: InputMaybe<Array<Scalars['String']['input']>>
    operatingDays: Array<Scalars['Date']['input']>
    privateCodes?: InputMaybe<Array<Scalars['String']['input']>>
    replacementFor?: InputMaybe<Array<Scalars['String']['input']>>
    serviceJourneys?: InputMaybe<Array<Scalars['String']['input']>>
}

export type TQueryTypeGroupOfLinesArgs = {
    id: Scalars['String']['input']
}

export type TQueryTypeLegArgs = {
    id: Scalars['ID']['input']
}

export type TQueryTypeLineArgs = {
    id: Scalars['ID']['input']
}

export type TQueryTypeLinesArgs = {
    authorities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
    flexibleOnly?: InputMaybe<Scalars['Boolean']['input']>
    ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>
    name?: InputMaybe<Scalars['String']['input']>
    publicCode?: InputMaybe<Scalars['String']['input']>
    publicCodes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
    transportModes?: InputMaybe<Array<InputMaybe<TTransportMode>>>
}

export type TQueryTypeNearestArgs = {
    after?: InputMaybe<Scalars['String']['input']>
    before?: InputMaybe<Scalars['String']['input']>
    filterByIds?: InputMaybe<TInputPlaceIds>
    filterByInUse?: InputMaybe<Scalars['Boolean']['input']>
    filterByModes?: InputMaybe<Array<InputMaybe<TTransportMode>>>
    filterByPlaceTypes?: InputMaybe<Array<InputMaybe<TFilterPlaceType>>>
    first?: InputMaybe<Scalars['Int']['input']>
    last?: InputMaybe<Scalars['Int']['input']>
    latitude: Scalars['Float']['input']
    longitude: Scalars['Float']['input']
    maximumDistance?: Scalars['Float']['input']
    maximumResults?: InputMaybe<Scalars['Int']['input']>
    multiModalMode?: InputMaybe<TMultiModalMode>
}

export type TQueryTypeOperatorArgs = {
    id: Scalars['String']['input']
}

export type TQueryTypeQuayArgs = {
    id: Scalars['String']['input']
}

export type TQueryTypeQuaysArgs = {
    ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
    name?: InputMaybe<Scalars['String']['input']>
}

export type TQueryTypeQuaysByBboxArgs = {
    authority?: InputMaybe<Scalars['String']['input']>
    filterByInUse?: InputMaybe<Scalars['Boolean']['input']>
    maximumLatitude: Scalars['Float']['input']
    maximumLongitude: Scalars['Float']['input']
    minimumLatitude: Scalars['Float']['input']
    minimumLongitude: Scalars['Float']['input']
}

export type TQueryTypeQuaysByRadiusArgs = {
    after?: InputMaybe<Scalars['String']['input']>
    authority?: InputMaybe<Scalars['String']['input']>
    before?: InputMaybe<Scalars['String']['input']>
    first?: InputMaybe<Scalars['Int']['input']>
    last?: InputMaybe<Scalars['Int']['input']>
    latitude: Scalars['Float']['input']
    longitude: Scalars['Float']['input']
    radius: Scalars['Float']['input']
}

export type TQueryTypeServiceJourneyArgs = {
    id: Scalars['String']['input']
}

export type TQueryTypeServiceJourneysArgs = {
    activeDates?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>
    authorities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
    lines?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>
    privateCodes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
}

export type TQueryTypeSituationArgs = {
    situationNumber: Scalars['String']['input']
}

export type TQueryTypeSituationsArgs = {
    codespaces?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
    severities?: InputMaybe<Array<InputMaybe<TSeverity>>>
}

export type TQueryTypeStopPlaceArgs = {
    id: Scalars['String']['input']
}

export type TQueryTypeStopPlacesArgs = {
    ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>
}

export type TQueryTypeStopPlacesByBboxArgs = {
    authority?: InputMaybe<Scalars['String']['input']>
    filterByInUse?: InputMaybe<Scalars['Boolean']['input']>
    maximumLatitude: Scalars['Float']['input']
    maximumLongitude: Scalars['Float']['input']
    minimumLatitude: Scalars['Float']['input']
    minimumLongitude: Scalars['Float']['input']
    multiModalMode?: InputMaybe<TMultiModalMode>
}

export type TQueryTypeTripArgs = {
    accessEgressPenalty?: InputMaybe<Array<TPenaltyForStreetMode>>
    alightSlackDefault?: InputMaybe<Scalars['Int']['input']>
    alightSlackList?: InputMaybe<Array<InputMaybe<TTransportModeSlack>>>
    arriveBy?: InputMaybe<Scalars['Boolean']['input']>
    banned?: InputMaybe<TInputBanned>
    bicycleOptimisationMethod?: InputMaybe<TBicycleOptimisationMethod>
    bikeSpeed?: InputMaybe<Scalars['Float']['input']>
    boardSlackDefault?: InputMaybe<Scalars['Int']['input']>
    boardSlackList?: InputMaybe<Array<InputMaybe<TTransportModeSlack>>>
    bookingTime?: InputMaybe<Scalars['DateTime']['input']>
    dateTime?: InputMaybe<Scalars['DateTime']['input']>
    extraSearchCoachReluctance?: InputMaybe<Scalars['Float']['input']>
    filters?: InputMaybe<Array<TTripFilterInput>>
    from: TLocation
    ignoreRealtimeUpdates?: InputMaybe<Scalars['Boolean']['input']>
    includePlannedCancellations?: InputMaybe<Scalars['Boolean']['input']>
    includeRealtimeCancellations?: InputMaybe<Scalars['Boolean']['input']>
    itineraryFilters?: InputMaybe<TItineraryFilters>
    locale?: InputMaybe<TLocale>
    maxAccessEgressDurationForMode?: InputMaybe<Array<TStreetModeDurationInput>>
    maxDirectDurationForMode?: InputMaybe<Array<TStreetModeDurationInput>>
    maximumAdditionalTransfers?: InputMaybe<Scalars['Int']['input']>
    maximumTransfers?: InputMaybe<Scalars['Int']['input']>
    modes?: InputMaybe<TModes>
    numTripPatterns?: InputMaybe<Scalars['Int']['input']>
    pageCursor?: InputMaybe<Scalars['String']['input']>
    passThroughPoints?: InputMaybe<Array<TPassThroughPoint>>
    relaxTransitGroupPriority?: InputMaybe<TRelaxCostInput>
    searchWindow?: InputMaybe<Scalars['Int']['input']>
    timetableView?: InputMaybe<Scalars['Boolean']['input']>
    to: TLocation
    transferPenalty?: InputMaybe<Scalars['Int']['input']>
    transferSlack?: InputMaybe<Scalars['Int']['input']>
    triangleFactors?: InputMaybe<TTriangleFactors>
    useBikeRentalAvailabilityInformation?: InputMaybe<
        Scalars['Boolean']['input']
    >
    waitReluctance?: InputMaybe<Scalars['Float']['input']>
    walkReluctance?: InputMaybe<Scalars['Float']['input']>
    walkSpeed?: InputMaybe<Scalars['Float']['input']>
    wheelchairAccessible?: InputMaybe<Scalars['Boolean']['input']>
    whiteListed?: InputMaybe<TInputWhiteListed>
}

export type TQueryTypeViaTripArgs = {
    dateTime?: InputMaybe<Scalars['DateTime']['input']>
    from: TLocation
    locale?: InputMaybe<TLocale>
    numTripPatterns?: InputMaybe<Scalars['Int']['input']>
    pageCursor?: InputMaybe<Scalars['String']['input']>
    searchWindow: Scalars['Duration']['input']
    segments?: InputMaybe<Array<TViaSegmentInput>>
    to: TLocation
    via: Array<TViaLocationInput>
    wheelchairAccessible?: InputMaybe<Scalars['Boolean']['input']>
}

export type TRealtimeState =
    /** The service journey has been added using a real-time update, i.e. the service journey was not present in the regular time table. */
    | 'Added'
    /** The service journey has been canceled by a real-time update. */
    | 'canceled'
    /** The service journey information has been updated and resulted in a different journey pattern compared to the journey pattern of the scheduled service journey. */
    | 'modified'
    /** The service journey information comes from the regular time table, i.e. no real-time update has been applied. */
    | 'scheduled'
    /** The service journey information has been updated, but the journey pattern stayed the same as the journey pattern of the scheduled service journey. */
    | 'updated'

export type TRelativeDirection =
    | 'circleClockwise'
    | 'circleCounterclockwise'
    | 'continue'
    | 'depart'
    | 'elevator'
    | 'hardLeft'
    | 'hardRight'
    | 'left'
    | 'right'
    | 'slightlyLeft'
    | 'slightlyRight'
    | 'uturnLeft'
    | 'uturnRight'

/**
 * A relax-cost is used to increase the limit when comparing one cost to another cost.
 * This is used to include more results into the result. A `ratio=2.0` means a path(itinerary)
 * with twice as high cost as another one, is accepted. A `constant=$300` means a "fixed"
 * constant is added to the limit. A `{ratio=1.0, constant=0}` is said to be the NORMAL relaxed
 * cost - the limit is the same as the cost used to calculate the limit. The NORMAL is usually
 * the default. We can express the RelaxCost as a function `f(t) = constant + ratio * t`.
 * `f(t)=t` is the NORMAL function.
 *
 */
export type TRelaxCostInput = {
    /** The constant value to add to the limit. Must be a positive number. The value is equivalent to transit-cost-seconds. Integers are treated as seconds, but you may use the duration format. Example: '3665 = 'DT1h1m5s' = '1h1m5s'. */
    constant?: InputMaybe<Scalars['Cost']['input']>
    /** The factor to multiply with the 'other cost'. Minimum value is 1.0. */
    ratio?: InputMaybe<Scalars['Float']['input']>
}

export type TRentalVehicle = TPlaceInterface & {
    __typename?: 'RentalVehicle'
    currentRangeMeters: Maybe<Scalars['Float']['output']>
    id: Scalars['ID']['output']
    latitude: Scalars['Float']['output']
    longitude: Scalars['Float']['output']
    network: Scalars['String']['output']
    vehicleType: TRentalVehicleType
}

export type TRentalVehicleType = {
    __typename?: 'RentalVehicleType'
    formFactor: Scalars['String']['output']
    maxRangeMeters: Maybe<Scalars['Float']['output']>
    name: Maybe<Scalars['String']['output']>
    propulsionType: Scalars['String']['output']
    vehicleTypeId: Scalars['String']['output']
}

export type TReportType =
    /** Indicates a general info-message that should not affect trip. */
    | 'general'
    /** Indicates an incident that may affect trip. */
    | 'incident'

/** Description of the reason, why the planner did not return any results */
export type TRoutingError = {
    __typename?: 'RoutingError'
    /** An enum describing the reason */
    code: TRoutingErrorCode
    /** A textual description of why the search failed. The clients are expected to have their own translations based on the code, for user visible error messages. */
    description: Scalars['String']['output']
    /** An enum describing the field which should be changed, in order for the search to succeed */
    inputField: Maybe<TInputField>
}

export type TRoutingErrorCode =
    /** The specified location is not close to any streets or transit stops */
    | 'locationNotFound'
    /** No stops are reachable from the location specified. You can try searching using a different access or egress mode */
    | 'noStopsInRange'
    /** No transit connection was found between the origin and destination withing the operating day or the next day */
    | 'noTransitConnection'
    /** A transit connection was found, but it was outside the search window. Use paging to navigate to a result. */
    | 'noTransitConnectionInSearchWindow'
    /** The coordinates are outside the bounds of the data currently loaded into the system */
    | 'outsideBounds'
    /** The date specified is outside the range of data currently loaded into the system */
    | 'outsideServicePeriod'
    /** The origin and destination are so close to each other, that walking is always better, but no direct mode was specified for the search */
    | 'walkingBetterThanTransit'

/** The default parameters used in travel searches. */
export type TRoutingParameters = {
    __typename?: 'RoutingParameters'
    /** The alightSlack is the minimum extra time after exiting a public transport vehicle. This is the default value used, if not overridden by the 'alightSlackList'. */
    alightSlackDefault: Maybe<Scalars['Int']['output']>
    /** List of alightSlack for a given set of modes. */
    alightSlackList: Maybe<Array<Maybe<TTransportModeSlackType>>>
    /** @deprecated Rental is specified by modes */
    allowBikeRental: Maybe<Scalars['Boolean']['output']>
    /** Separate cost for boarding a vehicle with a bicycle, which is more difficult than on foot. */
    bikeBoardCost: Maybe<Scalars['Int']['output']>
    /** Cost to park a bike. */
    bikeParkCost: Maybe<Scalars['Int']['output']>
    /** Time to park a bike. */
    bikeParkTime: Maybe<Scalars['Int']['output']>
    /** Cost to drop-off a rented bike. */
    bikeRentalDropOffCost: Maybe<Scalars['Int']['output']>
    /** Time to drop-off a rented bike. */
    bikeRentalDropOffTime: Maybe<Scalars['Int']['output']>
    /** Cost to rent a bike. */
    bikeRentalPickupCost: Maybe<Scalars['Int']['output']>
    /** Time to rent a bike. */
    bikeRentalPickupTime: Maybe<Scalars['Int']['output']>
    /** Max bike speed along streets, in meters per second */
    bikeSpeed: Maybe<Scalars['Float']['output']>
    /** The boardSlack is the minimum extra time to board a public transport vehicle. This is the same as the 'minimumTransferTime', except that this also applies to to the first transit leg in the trip. This is the default value used, if not overridden by the 'boardSlackList'. */
    boardSlackDefault: Maybe<Scalars['Int']['output']>
    /** List of boardSlack for a given set of modes. */
    boardSlackList: Maybe<Array<Maybe<TTransportModeSlackType>>>
    /** The acceleration speed of an automobile, in meters per second per second. */
    carAccelerationSpeed: Maybe<Scalars['Float']['output']>
    /** The deceleration speed of an automobile, in meters per second per second. */
    carDecelerationSpeed: Maybe<Scalars['Float']['output']>
    /** Time to park a car in a park and ride, w/o taking into account driving and walking cost. */
    carDropOffTime: Maybe<Scalars['Int']['output']>
    /**
     * Max car speed along streets, in meters per second
     * @deprecated This parameter is no longer configurable.
     */
    carSpeed: Maybe<Scalars['Float']['output']>
    /** @deprecated NOT IN USE IN OTP2. */
    compactLegsByReversedSearch: Maybe<Scalars['Boolean']['output']>
    /** @deprecated Use `itineraryFilter.debug` instead. */
    debugItineraryFilter: Maybe<Scalars['Boolean']['output']>
    /**
     * Option to disable the default filtering of GTFS-RT alerts by time.
     * @deprecated This is not supported!
     */
    disableAlertFiltering: Maybe<Scalars['Boolean']['output']>
    /** If true, the remaining weight heuristic is disabled. */
    disableRemainingWeightHeuristic: Maybe<Scalars['Boolean']['output']>
    /** What is the cost of boarding a elevator? */
    elevatorBoardCost: Maybe<Scalars['Int']['output']>
    /** How long does it take to get on an elevator, on average. */
    elevatorBoardTime: Maybe<Scalars['Int']['output']>
    /** What is the cost of travelling one floor on an elevator? */
    elevatorHopCost: Maybe<Scalars['Int']['output']>
    /** How long does it take to advance one floor on an elevator? */
    elevatorHopTime: Maybe<Scalars['Int']['output']>
    /** Whether to apply the ellipsoid->geoid offset to all elevations in the response. */
    geoIdElevation: Maybe<Scalars['Boolean']['output']>
    /** When true, real-time updates are ignored during this search. */
    ignoreRealTimeUpdates: Maybe<Scalars['Boolean']['output']>
    /** When true, service journeys cancelled in scheduled route data will be included during this search. */
    includedPlannedCancellations: Maybe<Scalars['Boolean']['output']>
    /** @deprecated Parking is specified by modes */
    kissAndRide: Maybe<Scalars['Boolean']['output']>
    /** Maximum number of transfers allowed in addition to the result with least number of transfers */
    maxAdditionalTransfers: Maybe<Scalars['Int']['output']>
    /** This is the maximum duration in seconds for a direct street search. This is a performance limit and should therefore be set high. Use filters to limit what is presented to the client. */
    maxDirectStreetDuration: Maybe<Scalars['Int']['output']>
    /** The maximum slope of streets for wheelchair trips. */
    maxSlope: Maybe<Scalars['Float']['output']>
    /** Maximum number of transfers returned in a trip plan. */
    maxTransfers: Maybe<Scalars['Int']['output']>
    /** The maximum number of itineraries to return. */
    numItineraries: Maybe<Scalars['Int']['output']>
    /**
     * Accept only paths that use transit (no street-only paths).
     * @deprecated This is replaced by modes input object
     */
    onlyTransitTrips: Maybe<Scalars['Boolean']['output']>
    /** Penalty added for using every route that is not preferred if user set any route as preferred. We return number of seconds that we are willing to wait for preferred route. */
    otherThanPreferredRoutesPenalty: Maybe<Scalars['Int']['output']>
    /** @deprecated Parking is specified by modes */
    parkAndRide: Maybe<Scalars['Boolean']['output']>
    /** @deprecated NOT IN USE IN OTP2. */
    reverseOptimizeOnTheFly: Maybe<Scalars['Boolean']['output']>
    /**
     * Whether the planner should return intermediate stops lists for transit legs.
     * @deprecated This parameter is always enabled
     */
    showIntermediateStops: Maybe<Scalars['Boolean']['output']>
    /** Used instead of walkReluctance for stairs. */
    stairsReluctance: Maybe<Scalars['Float']['output']>
    /** An extra penalty added on transfers (i.e. all boardings except the first one). */
    transferPenalty: Maybe<Scalars['Int']['output']>
    /** A global minimum transfer time (in seconds) that specifies the minimum amount of time that must pass between exiting one transit vehicle and boarding another. */
    transferSlack: Maybe<Scalars['Int']['output']>
    /** Multiplicative factor on expected turning time. */
    turnReluctance: Maybe<Scalars['Float']['output']>
    /** How much worse is waiting for a transit vehicle than being on a transit vehicle, as a multiplier. */
    waitReluctance: Maybe<Scalars['Float']['output']>
    /** This prevents unnecessary transfers by adding a cost for boarding a vehicle. */
    walkBoardCost: Maybe<Scalars['Int']['output']>
    /** A multiplier for how bad walking is, compared to being in transit for equal lengths of time. */
    walkReluctance: Maybe<Scalars['Float']['output']>
    /** Max walk speed along streets, in meters per second */
    walkSpeed: Maybe<Scalars['Float']['output']>
    /** Whether the trip must be wheelchair accessible. */
    wheelChairAccessible: Maybe<Scalars['Boolean']['output']>
}

export type TServerInfo = {
    __typename?: 'ServerInfo'
    /** The 'configVersion' of the build-config.json file. */
    buildConfigVersion: Maybe<Scalars['String']['output']>
    /** OTP Build timestamp */
    buildTime: Maybe<Scalars['String']['output']>
    gitBranch: Maybe<Scalars['String']['output']>
    gitCommit: Maybe<Scalars['String']['output']>
    gitCommitTime: Maybe<Scalars['String']['output']>
    /** The 'configVersion' of the otp-config.json file. */
    otpConfigVersion: Maybe<Scalars['String']['output']>
    /** The otp-serialization-version-id used to check graphs for compatibility with current version of OTP. */
    otpSerializationVersionId: Maybe<Scalars['String']['output']>
    /** The 'configVersion' of the router-config.json file. */
    routerConfigVersion: Maybe<Scalars['String']['output']>
    /** Maven version */
    version: Maybe<Scalars['String']['output']>
}

export type TServiceAlteration =
    | 'cancellation'
    | 'extraJourney'
    | 'planned'
    | 'replaced'

/** A planned vehicle journey with passengers. */
export type TServiceJourney = {
    __typename?: 'ServiceJourney'
    activeDates: Array<Maybe<Scalars['Date']['output']>>
    /** Whether bikes are allowed on service journey. */
    bikesAllowed: Maybe<TBikesAllowed>
    /**
     * Booking arrangements for flexible services.
     * @deprecated BookingArrangements are defined per stop, and can be found under `passingTimes` or `estimatedCalls`
     */
    bookingArrangements: Maybe<TBookingArrangement>
    directionType: Maybe<TDirectionType>
    /** Returns scheduled passingTimes for this ServiceJourney for a given date, updated with real-time-updates (if available). NB! This takes a date as argument (default=today) and returns estimatedCalls for that date and should only be used if the date is known when creating the request. For fetching estimatedCalls for a given trip.leg, use leg.serviceJourneyEstimatedCalls instead. */
    estimatedCalls: Maybe<Array<Maybe<TEstimatedCall>>>
    id: Scalars['ID']['output']
    /** JourneyPattern for the service journey, according to scheduled data. If the ServiceJourney is not included in the scheduled data, null is returned. */
    journeyPattern: Maybe<TJourneyPattern>
    line: TLine
    notices: Array<TNotice>
    operator: Maybe<TOperator>
    /** Returns scheduled passing times only - without real-time-updates, for realtime-data use 'estimatedCalls' */
    passingTimes: Array<Maybe<TTimetabledPassingTime>>
    /** Detailed path travelled by service journey. Not available for flexible trips. */
    pointsOnLink: Maybe<TPointsOnLink>
    /** For internal use by operators. */
    privateCode: Maybe<Scalars['String']['output']>
    /** Publicly announced code for service journey, differentiating it from other service journeys for the same line. */
    publicCode: Maybe<Scalars['String']['output']>
    /** Quays visited by service journey, according to scheduled data. If the ServiceJourney is not included in the scheduled data, an empty list is returned. */
    quays: Array<TQuay>
    /** @deprecated The service journey alteration will be moved out of SJ and grouped together with the SJ and date. In Netex this new type is called DatedServiceJourney. We will create artificial DSJs for the old SJs. */
    serviceAlteration: Maybe<TServiceAlteration>
    /** Get all situations active for the service journey. */
    situations: Array<TPtSituationElement>
    transportMode: Maybe<TTransportMode>
    transportSubmode: Maybe<TTransportSubmode>
    /** Whether service journey is accessible with wheelchair. */
    wheelchairAccessible: Maybe<TWheelchairBoarding>
}

/** A planned vehicle journey with passengers. */
export type TServiceJourneyEstimatedCallsArgs = {
    date?: InputMaybe<Scalars['Date']['input']>
}

/** A planned vehicle journey with passengers. */
export type TServiceJourneyQuaysArgs = {
    first?: InputMaybe<Scalars['Int']['input']>
    last?: InputMaybe<Scalars['Int']['input']>
}

export type TSeverity =
    /** Situation has no impact on trips. */
    | 'noImpact'
    /** Situation has an impact on trips (default). */
    | 'normal'
    /** Situation has a severe impact on trips. */
    | 'severe'
    /** Situation has a slight impact on trips. */
    | 'slight'
    /** Severity is undefined. */
    | 'undefined'
    /** Situation has unknown impact on trips. */
    | 'unknown'
    /** Situation has a very severe impact on trips. */
    | 'verySevere'
    /** Situation has a very slight impact on trips. */
    | 'verySlight'

export type TStopCondition =
    /** Situation applies when stop is the destination of the leg. */
    | 'destination'
    /** Situation applies when transfering to another leg at the stop. */
    | 'exceptionalStop'
    /** Situation applies when passing the stop, without stopping. */
    | 'notStopping'
    /** Situation applies when at the stop, and the stop requires a request to stop. */
    | 'requestStop'
    /** Situation applies when stop is the startpoint of the leg. */
    | 'startPoint'

/** Named place where public transport may be accessed. May be a building complex (e.g. a station) or an on-street location. */
export type TStopPlace = TPlaceInterface & {
    __typename?: 'StopPlace'
    description: Maybe<Scalars['String']['output']>
    /** List of visits to this stop place as part of vehicle journeys. */
    estimatedCalls: Array<TEstimatedCall>
    id: Scalars['ID']['output']
    latitude: Maybe<Scalars['Float']['output']>
    longitude: Maybe<Scalars['Float']['output']>
    name: Scalars['String']['output']
    /** Returns parent stop for this stop */
    parent: Maybe<TStopPlace>
    /** Returns all quays that are children of this stop place */
    quays: Maybe<Array<Maybe<TQuay>>>
    /** Get all situations active for the stop place. Situations affecting individual quays are not returned, and should be fetched directly from the quay. */
    situations: Array<TPtSituationElement>
    tariffZones: Array<Maybe<TTariffZone>>
    timeZone: Maybe<Scalars['String']['output']>
    /** The transport modes of quays under this stop place. */
    transportMode: Maybe<Array<Maybe<TTransportMode>>>
    /** The transport submode serviced by this stop place. */
    transportSubmode: Maybe<Array<Maybe<TTransportSubmode>>>
    /** Relative weighting of this stop with regards to interchanges. NOT IMPLEMENTED */
    weighting: Maybe<TInterchangeWeighting>
}

/** Named place where public transport may be accessed. May be a building complex (e.g. a station) or an on-street location. */
export type TStopPlaceEstimatedCallsArgs = {
    arrivalDeparture?: InputMaybe<TArrivalDeparture>
    includeCancelledTrips?: InputMaybe<Scalars['Boolean']['input']>
    numberOfDepartures?: InputMaybe<Scalars['Int']['input']>
    numberOfDeparturesPerLineAndDestinationDisplay?: InputMaybe<
        Scalars['Int']['input']
    >
    startTime?: InputMaybe<Scalars['DateTime']['input']>
    timeRange?: InputMaybe<Scalars['Int']['input']>
    whiteListed?: InputMaybe<TInputWhiteListed>
    whiteListedModes?: InputMaybe<Array<InputMaybe<TTransportMode>>>
}

/** Named place where public transport may be accessed. May be a building complex (e.g. a station) or an on-street location. */
export type TStopPlaceNameArgs = {
    language?: InputMaybe<Scalars['String']['input']>
}

/** Named place where public transport may be accessed. May be a building complex (e.g. a station) or an on-street location. */
export type TStopPlaceQuaysArgs = {
    filterByInUse?: InputMaybe<Scalars['Boolean']['input']>
}

/** List of coordinates between two stops as a polyline */
export type TStopToStopGeometry = {
    __typename?: 'StopToStopGeometry'
    /** Origin Quay */
    fromQuay: Maybe<TQuay>
    /** A list of coordinates encoded as a polyline string between two stops (see http://code.google.com/apis/maps/documentation/polylinealgorithm.html) */
    pointsOnLink: Maybe<TPointsOnLink>
    /** Destination Quay */
    toQuay: Maybe<TQuay>
}

export type TStreetMode =
    /** Bike only. This can be used as access/egress, but transfers will still be walk only. */
    | 'bicycle'
    /** Bike to a bike parking area, then walk the rest of the way. Direct mode and access mode only. */
    | 'bike_park'
    /** Walk to a bike rental point, bike to a bike rental drop-off point, and walk the rest of the way. This can include bike rental at fixed locations or free-floating services. */
    | 'bike_rental'
    /** Car only. Direct mode only. */
    | 'car'
    /** Start in the car, drive to a parking area, and walk the rest of the way. Direct mode and access mode only. */
    | 'car_park'
    /** Walk to a pickup point along the road, drive to a drop-off point along the road, and walk the rest of the way. This can include various taxi-services or kiss & ride. */
    | 'car_pickup'
    /** Walk to an eligible pickup area for flexible transportation, ride to an eligible drop-off area and then walk the rest of the way. */
    | 'flexible'
    /** Walk only */
    | 'foot'
    /** Walk to a scooter rental point, ride a scooter to a scooter rental drop-off point, and walk the rest of the way. This can include scooter rental at fixed locations or free-floating services. */
    | 'scooter_rental'

/** A combination of street mode and corresponding duration */
export type TStreetModeDurationInput = {
    duration: Scalars['Duration']['input']
    streetMode: TStreetMode
}

/** Input format for specifying which modes will be allowed for this search. If this element is not present, it will default to all to foot. */
export type TStreetModes = {
    /** The mode used to get from the origin to the access stops in the transit network the transit network (first-mile). If the element is not present or null,only transit that can be immediately boarded from the origin will be used. */
    accessMode?: InputMaybe<TStreetMode>
    /** The mode used to get from the origin to the destination directly, without using the transit network. If the element is not present or null,direct travel without using transit will be disallowed. */
    directMode?: InputMaybe<TStreetMode>
    /** The mode used to get from the egress stops in the transit network tothe destination (last-mile). If the element is not present or null,only transit that can immediately arrive at the origin will be used. */
    egressMode?: InputMaybe<TStreetMode>
}

/**
 * A system notice is used to tag elements with system information for debugging or other
 * system related purpose. One use-case is to run a routing search with
 * `itineraryFilters.debug=listAll`. This will then tag itineraries instead of removing
 * them from the result. This make it possible to inspect the itinerary-filter-chain. A
 * SystemNotice only have english text, because the primary user are technical staff, like
 * testers and developers.
 *
 * **NOTE!** _A SystemNotice is for debugging the system, avoid putting logic on it in the
 * client. The tags and usage may change without notice._
 */
export type TSystemNotice = {
    __typename?: 'SystemNotice'
    tag: Maybe<Scalars['String']['output']>
    text: Maybe<Scalars['String']['output']>
}

export type TTariffZone = {
    __typename?: 'TariffZone'
    id: Scalars['ID']['output']
    name: Maybe<Scalars['String']['output']>
}

export type TTimeAndDayOffset = {
    __typename?: 'TimeAndDayOffset'
    /** Number of days offset from base line time */
    dayOffset: Maybe<Scalars['Int']['output']>
    /** Local time */
    time: Maybe<Scalars['Time']['output']>
}

/**
 * The time-penalty is applied to either the access-legs and/or egress-legs. Both access and
 * egress may contain more than one leg; Hence, the penalty is not a field on leg.
 *
 * Note! This is for debugging only. This type can change without notice.
 *
 */
export type TTimePenalty = {
    __typename?: 'TimePenalty'
    /**
     * The time-penalty is applied to either the access-legs and/or egress-legs. Both access
     * and egress may contain more than one leg; Hence, the penalty is not a field on leg. The
     * `appliedTo` describe witch part of the itinerary that this instance applies to.
     *
     */
    appliedTo: Maybe<Scalars['String']['output']>
    /**
     * The time-penalty does also propagate to the `generalizedCost` But, while the
     * arrival-/departure-times listed is not affected, the generalized-cost is. In some cases
     * the time-penalty-cost is excluded when comparing itineraries - that happens if one of
     * the itineraries is a "direct/street-only" itinerary. Time-penalty can not be set for
     * direct searches, so it needs to be excluded from such comparison to be fair. The unit
     * is transit-seconds.
     *
     */
    generalizedCostPenalty: Maybe<Scalars['Int']['output']>
    /**
     * The time-penalty added to the actual time/duration when comparing the itinerary with
     * other itineraries. This is used to decide witch is the best option, but is not visible
     * - the actual departure and arrival-times are not modified.
     *
     */
    timePenalty: Maybe<Scalars['String']['output']>
}

/** Scheduled passing times. These are not affected by real time updates. */
export type TTimetabledPassingTime = {
    __typename?: 'TimetabledPassingTime'
    /** Scheduled time of arrival at quay */
    arrival: Maybe<TTimeAndDayOffset>
    /** Booking arrangements for this passing time. */
    bookingArrangements: Maybe<TBookingArrangement>
    /** Scheduled time of departure from quay */
    departure: Maybe<TTimeAndDayOffset>
    destinationDisplay: Maybe<TDestinationDisplay>
    /** Earliest possible departure time for a service journey with a service window. */
    earliestDepartureTime: Maybe<TTimeAndDayOffset>
    /** Whether vehicle may be alighted at quay. */
    forAlighting: Scalars['Boolean']['output']
    /** Whether vehicle may be boarded at quay. */
    forBoarding: Scalars['Boolean']['output']
    /** Latest possible (planned) arrival time for a service journey with a service window. */
    latestArrivalTime: Maybe<TTimeAndDayOffset>
    notices: Array<TNotice>
    quay: TQuay
    /** Whether vehicle will only stop on request. */
    requestStop: Scalars['Boolean']['output']
    serviceJourney: TServiceJourney
    /** Whether this is a timing point or not. Boarding and alighting is not allowed at timing points. */
    timingPoint: Scalars['Boolean']['output']
}

export type TTransitGeneralizedCostFilterParams = {
    costLimitFunction: Scalars['DoubleFunction']['input']
    intervalRelaxFactor: Scalars['Float']['input']
}

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

/** Used to specify board and alight slack for a given modes. */
export type TTransportModeSlack = {
    /** List of modes for which the given slack apply. */
    modes: Array<TTransportMode>
    /** The slack used for all given modes. */
    slack: Scalars['Int']['input']
}

/** Used to specify board and alight slack for a given modes. */
export type TTransportModeSlackType = {
    __typename?: 'TransportModeSlackType'
    modes: Array<TTransportMode>
    slack: Scalars['Int']['output']
}

export type TTransportModes = {
    /** A transportMode that should be allowed for this search. You can furthernarrow it down by specifying a list of transportSubModes */
    transportMode?: InputMaybe<TTransportMode>
    /** The allowed transportSubModes for this search. If this element is notpresent or null, it will default to all transportSubModes for the specifiedTransportMode. Be aware that all transportSubModes have an associated TransportMode, which must match what is specified in the transportMode field. */
    transportSubModes?: InputMaybe<Array<InputMaybe<TTransportSubmode>>>
}

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

/** How much the factors safety, slope and distance are weighted relative to each other when routing bicycle legs. In total all three values need to add up to 1. */
export type TTriangleFactors = {
    /** How important is bicycle safety expressed as a fraction of 1. */
    safety: Scalars['Float']['input']
    /** How important is slope/elevation expressed as a fraction of 1. */
    slope: Scalars['Float']['input']
    /** How important is time expressed as a fraction of 1. Note that what this really optimises for is distance (even if that means going over terrible surfaces, so I might be slower than the safe route). */
    time: Scalars['Float']['input']
}

/** Description of a travel between two places. */
export type TTrip = {
    __typename?: 'Trip'
    /** The time and date of travel */
    dateTime: Maybe<Scalars['DateTime']['output']>
    /** Information about the timings for the trip generation */
    debugOutput: TDebugOutput
    /** The origin */
    fromPlace: TPlace
    /**
     * A list of possible error messages as enum
     * @deprecated Use routingErrors instead
     */
    messageEnums: Array<Maybe<Scalars['String']['output']>>
    /**
     * A list of possible error messages in cleartext
     * @deprecated Use routingErrors instead
     */
    messageStrings: Array<Maybe<Scalars['String']['output']>>
    /** The trip request metadata. */
    metadata: Maybe<TTripSearchData>
    /**
     * Use the cursor to get the next page of results. Use this cursor for the pageCursor parameter in the trip query in order to get the next page.
     * The next page is a set of itineraries departing AFTER the last itinerary in this result.
     */
    nextPageCursor: Maybe<Scalars['String']['output']>
    /**
     * Use the cursor to get the previous page of results. Use this cursor for the pageCursor parameter in the trip query in order to get the previous page.
     * The previous page is a set of itineraries departing BEFORE the first itinerary in this result.
     */
    previousPageCursor: Maybe<Scalars['String']['output']>
    /** A list of routing errors, and fields which caused them */
    routingErrors: Array<TRoutingError>
    /** The destination */
    toPlace: TPlace
    /** A list of possible trip patterns */
    tripPatterns: Array<TTripPattern>
}

/** Description of a travel between two places. */
export type TTripMessageStringsArgs = {
    language?: InputMaybe<Scalars['String']['input']>
}

/** A collection of selectors for what lines/trips should be included in / excluded from search */
export type TTripFilterInput = {
    /** A list of selectors for what lines/trips should be excluded during the search. If line/trip matches with at least one selector it will be excluded. */
    not?: InputMaybe<Array<TTripFilterSelectInput>>
    /** A list of selectors for what lines/trips should be allowed during search. In order to be accepted a trip/line has to match with at least one selector. An empty list means that everything should be allowed.  */
    select?: InputMaybe<Array<TTripFilterSelectInput>>
}

/** A list of selectors for filter allow-list / exclude-list. An empty list means that everything is allowed. A trip/line will match with selectors if it matches with all non-empty lists. The `select` is always applied first, then `not`. If only `not` not is present, the exclude is applied to the existing set of lines.  */
export type TTripFilterSelectInput = {
    /** Set of ids for authorities that should be included in/excluded from search */
    authorities?: InputMaybe<Array<Scalars['ID']['input']>>
    /** Set of ids for group of lines that should be included in/excluded from the search */
    groupOfLines?: InputMaybe<Array<Scalars['ID']['input']>>
    /** Set of ids for lines that should be included in/excluded from search */
    lines?: InputMaybe<Array<Scalars['ID']['input']>>
    /** Set of ids for service journeys that should be included in/excluded from search */
    serviceJourneys?: InputMaybe<Array<Scalars['ID']['input']>>
    /** The allowed modes for the transit part of the trip. Use an empty list to disallow transit for this search. If the element is not present or null, it will default to all transport modes. */
    transportModes?: InputMaybe<Array<TTransportModes>>
}

/** List of legs constituting a suggested sequence of rides and links for a specific trip. */
export type TTripPattern = {
    __typename?: 'TripPattern'
    /** The aimed date and time the trip ends. */
    aimedEndTime: Scalars['DateTime']['output']
    /** The aimed date and time the trip starts. */
    aimedStartTime: Scalars['DateTime']['output']
    /** NOT IMPLEMENTED. */
    directDuration: Maybe<Scalars['Long']['output']>
    /** Total distance for the trip, in meters. NOT IMPLEMENTED */
    distance: Maybe<Scalars['Float']['output']>
    /** Duration of the trip, in seconds. */
    duration: Maybe<Scalars['Long']['output']>
    /**
     * Time that the trip arrives.
     * @deprecated Replaced with expectedEndTime
     */
    endTime: Maybe<Scalars['DateTime']['output']>
    /** The expected, real-time adjusted date and time the trip ends. */
    expectedEndTime: Scalars['DateTime']['output']
    /** The expected, real-time adjusted date and time the trip starts. */
    expectedStartTime: Scalars['DateTime']['output']
    /** Generalized cost or weight of the itinerary. Used for debugging. */
    generalizedCost: Maybe<Scalars['Int']['output']>
    /** A second cost or weight of the itinerary. Some use-cases like pass-through and transit-priority-groups use a second cost during routing. This is used for debugging. */
    generalizedCost2: Maybe<Scalars['Int']['output']>
    /** A list of legs. Each leg is either a walking (cycling, car) portion of the trip, or a ride leg on a particular vehicle. So a trip where the use walks to the Q train, transfers to the 6, then walks to their destination, has four legs. */
    legs: Array<TLeg>
    /**
     * Time that the trip departs.
     * @deprecated Replaced with expectedStartTime
     */
    startTime: Maybe<Scalars['DateTime']['output']>
    /** How far the user has to walk, bike and/or drive in meters. It includes all street(none transit) modes. */
    streetDistance: Maybe<Scalars['Float']['output']>
    /** Get all system notices. */
    systemNotices: Array<TSystemNotice>
    /**
     * A time and cost penalty applied to access and egress to favor regular scheduled
     * transit over potentially faster options with FLEX, Car, bike and scooter.
     *
     * Note! This field is meant for debugging only. The field can be removed without notice
     * in the future.
     *
     */
    timePenalty: Array<TTimePenalty>
    /** A cost calculated to favor transfer with higher priority. This field is meant for debugging only. */
    transferPriorityCost: Maybe<Scalars['Int']['output']>
    /** A cost calculated to distribute wait-time and avoid very short transfers. This field is meant for debugging only. */
    waitTimeOptimizedCost: Maybe<Scalars['Int']['output']>
    /** How much time is spent waiting for transit to arrive, in seconds. */
    waitingTime: Maybe<Scalars['Long']['output']>
    /** @deprecated Replaced by `streetDistance`. */
    walkDistance: Maybe<Scalars['Float']['output']>
    /** How much time is spent walking, in seconds. */
    walkTime: Maybe<Scalars['Long']['output']>
}

/** Trips search metadata. */
export type TTripSearchData = {
    __typename?: 'TripSearchData'
    /**
     * This is the suggested search time for the "next page" or time window. Insert it together with the 'searchWindowUsed' in the request to get a new set of trips following in the time-window AFTER the current search.
     * @deprecated Use pageCursor instead
     */
    nextDateTime: Maybe<Scalars['DateTime']['output']>
    /**
     * This is the suggested search time for the "previous page" or time-window. Insert it together with the 'searchWindowUsed' in the request to get a new set of trips preceding in the time-window BEFORE the current search.
     * @deprecated Use pageCursor instead
     */
    prevDateTime: Maybe<Scalars['DateTime']['output']>
    /** This is the time window used by the raptor search. The input searchWindow is an optional parameter and is dynamically assigned if not set. OTP might override the value if it is too small or too large. When paging OTP adjusts it to the appropriate size, depending on the number of itineraries found in the current search window. The scaling of the search window ensures faster paging and limits resource usage. The unit is seconds. */
    searchWindowUsed: Scalars['Int']['output']
}

export type TValidityPeriod = {
    __typename?: 'ValidityPeriod'
    /** End of validity period. Will return 'null' if validity is open-ended. */
    endTime: Maybe<Scalars['DateTime']['output']>
    /** Start of validity period */
    startTime: Maybe<Scalars['DateTime']['output']>
}

export type TVertexType = 'bikePark' | 'bikeShare' | 'normal' | 'transit'

/** An acceptable combination of trip patterns between two segments of the via search */
export type TViaConnection = {
    __typename?: 'ViaConnection'
    /** The index of the trip pattern in the segment before the via point */
    from: Maybe<Scalars['Int']['output']>
    /** The index of the trip pattern in the segment after the via point */
    to: Maybe<Scalars['Int']['output']>
}

/** Input format for specifying a location through either a place reference (id), coordinates or both. If both place and coordinates are provided the place ref will be used if found, coordinates will only be used if place is not known. The location also contain information about the minimum and maximum time the user is willing to stay at the via location. */
export type TViaLocationInput = {
    /** Coordinates for the location. This can be used alone or as fallback if the place id is not found. */
    coordinates?: InputMaybe<TInputCoordinates>
    /** The maximum time the user wants to stay in the via location before continuing his journey */
    maxSlack?: InputMaybe<Scalars['Duration']['input']>
    /** The minimum time the user wants to stay in the via location before continuing his journey */
    minSlack?: InputMaybe<Scalars['Duration']['input']>
    /** The name of the location. This is pass-through information and is not used in routing. */
    name?: InputMaybe<Scalars['String']['input']>
    /** The id of an element in the OTP model. Currently supports Quay, StopPlace, multimodal StopPlace, and GroupOfStopPlaces. */
    place?: InputMaybe<Scalars['String']['input']>
}

export type TViaSegmentInput = {
    /** A list of filters for which trips should be included. A trip will be included if it matches with at least one filter. An empty list of filters means that all trips should be included. */
    filters?: InputMaybe<Array<TTripFilterInput>>
    /** The set of access/egress/direct modes to be used for this search. */
    modes?: InputMaybe<TStreetModes>
}

/** Description of a trip via one or more intermediate locations. For example from A, via B, then C to D. */
export type TViaTrip = {
    __typename?: 'ViaTrip'
    /** A list of routing errors, and fields which caused them */
    routingErrors: Array<TRoutingError>
    /** A list of the acceptable combinations of the trip patterns in this segment and the next segment. */
    tripPatternCombinations: Array<Array<TViaConnection>>
    /** A list of segments of the via search. The first segment is from the start location to the first entry in the locations list and the last is from the last entry in the locations list to the end location. */
    tripPatternsPerSegment: Array<TViaTripPatternSegment>
}

/** A segment of the via search. The first segment is from the start location to the first entry in the locations list and the last is from the last entry in the locations list to the end location. */
export type TViaTripPatternSegment = {
    __typename?: 'ViaTripPatternSegment'
    /** A list of trip patterns for this segment of the search */
    tripPatterns: Array<TTripPattern>
}

export type TWheelchairBoarding =
    /** There is no accessibility information for the stopPlace/quay. */
    | 'noInformation'
    /** Wheelchair boarding/alighting is not possible at this stop. */
    | 'notPossible'
    /** Boarding wheelchair-accessible serviceJourneys is possible at this stopPlace/quay. */
    | 'possible'

export type TDebugOutput = {
    __typename?: 'debugOutput'
    totalTime: Maybe<Scalars['Long']['output']>
}

export type TInfoLink = {
    __typename?: 'infoLink'
    /** Label */
    label: Maybe<Scalars['String']['output']>
    /** URI */
    uri: Scalars['String']['output']
}

/** A connection to a list of items. */
export type TPlaceAtDistanceConnection = {
    __typename?: 'placeAtDistanceConnection'
    /** a list of edges */
    edges: Maybe<Array<Maybe<TPlaceAtDistanceEdge>>>
    /** details about this specific page */
    pageInfo: TPageInfo
}

/** An edge in a connection */
export type TPlaceAtDistanceEdge = {
    __typename?: 'placeAtDistanceEdge'
    /** cursor marks a unique position or index into the connection */
    cursor: Scalars['String']['output']
    /** The item at the end of the edge */
    node: Maybe<TPlaceAtDistance>
}

/** A connection to a list of items. */
export type TQuayAtDistanceConnection = {
    __typename?: 'quayAtDistanceConnection'
    /** a list of edges */
    edges: Maybe<Array<Maybe<TQuayAtDistanceEdge>>>
    /** details about this specific page */
    pageInfo: TPageInfo
}

/** An edge in a connection */
export type TQuayAtDistanceEdge = {
    __typename?: 'quayAtDistanceEdge'
    /** cursor marks a unique position or index into the connection */
    cursor: Scalars['String']['output']
    /** The item at the end of the edge */
    node: Maybe<TQuayAtDistance>
}
