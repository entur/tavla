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
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string
    String: string
    Boolean: boolean
    Int: number
    Float: number
    Coordinates: Coordinates
    Date: Date
    DateTime: DateTime
    DoubleFunction: DoubleFunction
    Duration: Duration
    LocalTime: LocalTime
    Long: Long
    Time: Time
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
    line?: Maybe<TLine>
}

export type TAffectedServiceJourney = {
    __typename?: 'AffectedServiceJourney'
    datedServiceJourney?: Maybe<TDatedServiceJourney>
    operatingDay?: Maybe<Scalars['Date']>
    serviceJourney?: Maybe<TServiceJourney>
}

export type TAffectedStopPlace = {
    __typename?: 'AffectedStopPlace'
    quay?: Maybe<TQuay>
    stopConditions: Array<TStopCondition>
    stopPlace?: Maybe<TStopPlace>
}

export type TAffectedStopPlaceOnLine = {
    __typename?: 'AffectedStopPlaceOnLine'
    line?: Maybe<TLine>
    quay?: Maybe<TQuay>
    stopConditions: Array<TStopCondition>
    stopPlace?: Maybe<TStopPlace>
}

export type TAffectedStopPlaceOnServiceJourney = {
    __typename?: 'AffectedStopPlaceOnServiceJourney'
    datedServiceJourney?: Maybe<TDatedServiceJourney>
    operatingDay?: Maybe<Scalars['Date']>
    quay?: Maybe<TQuay>
    serviceJourney?: Maybe<TServiceJourney>
    stopConditions: Array<TStopCondition>
    stopPlace?: Maybe<TStopPlace>
}

export type TAffectedUnknown = {
    __typename?: 'AffectedUnknown'
    description?: Maybe<Scalars['String']>
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
    fareUrl?: Maybe<Scalars['String']>
    id: Scalars['ID']
    lang?: Maybe<Scalars['String']>
    lines: Array<Maybe<TLine>>
    name: Scalars['String']
    phone?: Maybe<Scalars['String']>
    /** Get all situations active for the authority. */
    situations: Array<TPtSituationElement>
    timezone: Scalars['String']
    url?: Maybe<Scalars['String']>
}

export type TBicycleOptimisationMethod =
    | 'flat'
    | 'greenways'
    | 'quick'
    | 'safe'
    | 'triangle'

export type TBikePark = TPlaceInterface & {
    __typename?: 'BikePark'
    id: Scalars['ID']
    latitude?: Maybe<Scalars['Float']>
    longitude?: Maybe<Scalars['Float']>
    name: Scalars['String']
    realtime?: Maybe<Scalars['Boolean']>
    spacesAvailable?: Maybe<Scalars['Int']>
}

export type TBikeRentalStation = TPlaceInterface & {
    __typename?: 'BikeRentalStation'
    allowDropoff?: Maybe<Scalars['Boolean']>
    bikesAvailable?: Maybe<Scalars['Int']>
    id: Scalars['ID']
    latitude?: Maybe<Scalars['Float']>
    longitude?: Maybe<Scalars['Float']>
    name: Scalars['String']
    networks: Array<Maybe<Scalars['String']>>
    realtimeOccupancyAvailable?: Maybe<Scalars['Boolean']>
    spacesAvailable?: Maybe<Scalars['Int']>
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
    bookWhen?: Maybe<TPurchaseWhen>
    /** Who should ticket be contacted for booking */
    bookingContact?: Maybe<TContact>
    /** How should service be booked? */
    bookingMethods?: Maybe<Array<Maybe<TBookingMethod>>>
    /** Textual description of booking arrangement for service */
    bookingNote?: Maybe<Scalars['String']>
    /** How many days prior to the travel the service needs to be booked */
    latestBookingDay?: Maybe<Scalars['Int']>
    /** Latest time the service can be booked. ISO 8601 timestamp */
    latestBookingTime?: Maybe<Scalars['LocalTime']>
    /** Minimum period in advance service can be booked as a ISO 8601 duration */
    minimumBookingPeriod?: Maybe<Scalars['String']>
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
    description?: Maybe<Scalars['String']>
    id?: Maybe<Scalars['ID']>
    /** URL to an image be used for branding */
    image?: Maybe<Scalars['String']>
    /** Full name to be used for branding. */
    name?: Maybe<Scalars['String']>
    /** Short name to be used for branding. */
    shortName?: Maybe<Scalars['String']>
    /** URL to be used for branding */
    url?: Maybe<Scalars['String']>
}

export type TContact = {
    __typename?: 'Contact'
    /** Name of person to contact */
    contactPerson?: Maybe<Scalars['String']>
    /** Email adress for contact */
    email?: Maybe<Scalars['String']>
    /** Textual description of how to get in contact */
    furtherDetails?: Maybe<Scalars['String']>
    /** Phone number for contact */
    phone?: Maybe<Scalars['String']>
    /** Url for contact */
    url?: Maybe<Scalars['String']>
}

/** A planned journey on a specific day */
export type TDatedServiceJourney = {
    __typename?: 'DatedServiceJourney'
    /** Returns scheduled passingTimes for this dated service journey, updated with realtime-updates (if available).  */
    estimatedCalls?: Maybe<Array<Maybe<TEstimatedCall>>>
    id: Scalars['ID']
    /** JourneyPattern for the dated service journey. */
    journeyPattern?: Maybe<TJourneyPattern>
    /** The date this service runs. The date used is based on the service date as opposed to calendar date. */
    operatingDay?: Maybe<Scalars['Date']>
    /** Quays visited by the dated service journey. */
    quays: Array<TQuay>
    /** List of the dated service journeys this dated service journeys replaces */
    replacementFor: Array<TDatedServiceJourney>
    /** The service journey this Dated Service Journey is based on */
    serviceJourney: TServiceJourney
    /** Alterations specified on the Trip in the planned data */
    tripAlteration?: Maybe<TServiceAlteration>
}

/** A planned journey on a specific day */
export type TDatedServiceJourneyQuaysArgs = {
    first?: InputMaybe<Scalars['Int']>
    last?: InputMaybe<Scalars['Int']>
}

/** An advertised destination of a specific journey pattern, usually displayed on a head sign or at other on-board locations. */
export type TDestinationDisplay = {
    __typename?: 'DestinationDisplay'
    /** Name of destination to show on front of vehicle. */
    frontText?: Maybe<Scalars['String']>
    /** Intermediary destinations which the vehicle will pass before reaching its final destination. */
    via?: Maybe<Array<Maybe<Scalars['String']>>>
}

export type TDirectionType =
    | 'anticlockwise'
    | 'clockwise'
    | 'inbound'
    | 'outbound'
    | 'unknown'

/** List of visits to quays as part of vehicle journeys. Updated with real time information where available */
export type TEstimatedCall = {
    __typename?: 'EstimatedCall'
    /** Actual time of arrival at quay. Updated from real time information if available. NOT IMPLEMENTED */
    actualArrivalTime?: Maybe<Scalars['DateTime']>
    /** Actual time of departure from quay. Updated with real time information if available. NOT IMPLEMENTED */
    actualDepartureTime?: Maybe<Scalars['DateTime']>
    /** Scheduled time of arrival at quay. Not affected by read time updated */
    aimedArrivalTime: Scalars['DateTime']
    /** Scheduled time of departure from quay. Not affected by read time updated */
    aimedDepartureTime: Scalars['DateTime']
    /** Booking arrangements for this EstimatedCall. */
    bookingArrangements?: Maybe<TBookingArrangement>
    /** Whether stop is cancelled. This means that either the ServiceJourney has a planned cancellation, the ServiceJourney has been cancelled by realtime data, or this particular StopPoint has been cancelled. This also means that both boarding and alighting has been cancelled. */
    cancellation: Scalars['Boolean']
    /** The date the estimated call is valid for. */
    date: Scalars['Date']
    datedServiceJourney?: Maybe<TDatedServiceJourney>
    destinationDisplay?: Maybe<TDestinationDisplay>
    /** Expected time of arrival at quay. Updated with real time information if available. Will be null if an actualArrivalTime exists */
    expectedArrivalTime: Scalars['DateTime']
    /** Expected time of departure from quay. Updated with real time information if available. Will be null if an actualDepartureTime exists */
    expectedDepartureTime: Scalars['DateTime']
    /** Whether vehicle may be alighted at quay. */
    forAlighting: Scalars['Boolean']
    /** Whether vehicle may be boarded at quay. */
    forBoarding: Scalars['Boolean']
    notices: Array<TNotice>
    occupancyStatus: TOccupancyStatus
    /** Whether the updated estimates are expected to be inaccurate. */
    predictionInaccurate: Scalars['Boolean']
    quay: TQuay
    /** Whether this call has been updated with real time information. */
    realtime: Scalars['Boolean']
    realtimeState: TRealtimeState
    /** Whether vehicle will only stop on request. */
    requestStop: Scalars['Boolean']
    serviceJourney: TServiceJourney
    /** Get all relevant situations for this EstimatedCall. */
    situations: Array<TPtSituationElement>
    stopPositionInPattern: Scalars['Int']
    /** Whether this is a timing point or not. Boarding and alighting is not allowed at timing points. */
    timingPoint: Scalars['Boolean']
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
    description?: Maybe<Scalars['String']>
    id: Scalars['ID']
    /** All lines part of this group of lines */
    lines: Array<TLine>
    /** Full name for group of lines. */
    name?: Maybe<Scalars['String']>
    /** For internal use by operator/authority. */
    privateCode?: Maybe<Scalars['String']>
    /** Short name for group of lines. */
    shortName?: Maybe<Scalars['String']>
}

/** Filter trips by disallowing lines involving certain elements. If both lines and authorities are specified, only one must be valid for each line to be banned. If a line is both banned and whitelisted, it will be counted as banned. */
export type TInputBanned = {
    /** Set of ids for authorities that should not be used */
    authorities?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
    /** Set of ids for lines that should not be used */
    lines?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
    /** NOT IMPLEMENTED. Set of ids of quays that should not be allowed for boarding or alighting. Trip patterns that travel through the quay will still be permitted. */
    quays?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
    /** NOT IMPLEMENTED. Set of ids of quays that should not be allowed for boarding, alighting or traveling thorugh. */
    quaysHard?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
    /** Set of ids of rental networks that should not be allowed for renting vehicles. */
    rentalNetworks?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
    /** Set of ids of service journeys that should not be used. */
    serviceJourneys?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
}

/** Input type for coordinates in the WGS84 system */
export type TInputCoordinates = {
    /** The latitude of the place. */
    latitude: Scalars['Float']
    /** The longitude of the place. */
    longitude: Scalars['Float']
}

export type TInputField = 'dateTime' | 'from' | 'to'

export type TInputPlaceIds = {
    /** Bike parks to include by id. */
    bikeParks?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
    /** Bike rentals to include by id. */
    bikeRentalStations?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
    /** Car parks to include by id. */
    carParks?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
    /** Lines to include by id. */
    lines?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
    /** Quays to include by id. */
    quays?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

/** Filter trips by only allowing lines involving certain elements. If both lines and authorities are specified, only one must be valid for each line to be used. If a line is both banned and whitelisted, it will be counted as banned. */
export type TInputWhiteListed = {
    /** Set of ids for authorities that should be used */
    authorities?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
    /** Set of ids for lines that should be used */
    lines?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
    /** Set of ids of rental networks that should be used for renting vehicles. */
    rentalNetworks?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
}

export type TInterchange = {
    __typename?: 'Interchange'
    /** @deprecated This is the same as using the `fromServiceJourney { line }` field. */
    FromLine?: Maybe<TLine>
    /** @deprecated Use fromServiceJourney instead */
    FromServiceJourney?: Maybe<TServiceJourney>
    /** @deprecated This is the same as using the `toServiceJourney { line }` field. */
    ToLine?: Maybe<TLine>
    /** @deprecated Use toServiceJourney instead */
    ToServiceJourney?: Maybe<TServiceJourney>
    fromServiceJourney?: Maybe<TServiceJourney>
    guaranteed?: Maybe<Scalars['Boolean']>
    /** Maximum time after scheduled departure time the connecting transport is guarantied to wait for the delayed trip. [NOT RESPECTED DURING ROUTING, JUST PASSED THROUGH] */
    maximumWaitTime?: Maybe<Scalars['Int']>
    /** The transfer priority is used to decide where a transfer should happen, at the highest prioritized location. If the guarantied flag is set it take precedence priority. A guarantied ALLOWED transfer is preferred over a PREFERRED none-guarantied transfer. */
    priority?: Maybe<TInterchangePriority>
    staySeated?: Maybe<Scalars['Boolean']>
    toServiceJourney?: Maybe<TServiceJourney>
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

/** Parameters for the OTP Itinerary Filter Chain. These parameters SHOULD be configured on the server side and should not be used by the client. They are made available here to be able to experiment and tune the server. */
export type TItineraryFilters = {
    /** Pick ONE itinerary from each group after putting itineraries that is 85% similar together. */
    groupSimilarityKeepOne?: InputMaybe<Scalars['Float']>
    /** Reduce the number of itineraries in each group to to maximum 3 itineraries. The itineraries are grouped by similar legs (on board same journey). So, if  68% of the distance is traveled by similar legs, then two itineraries are in the same group. Default value is 68%, must be at least 50%. */
    groupSimilarityKeepThree?: InputMaybe<Scalars['Float']>
    /** Of the itineraries grouped to maximum of three itineraries, how much worse can the non-grouped legs be compared to the lowest cost. 2.0 means that they can be double the cost, and any itineraries having a higher cost will be filtered. Default value is 2.0, use a value lower than 1.0 to turn off */
    groupedOtherThanSameLegsMaxCostMultiplier?: InputMaybe<Scalars['Float']>
    /** Set a relative limit for all transit itineraries. The limit is calculated based on the transit itinerary generalized-cost and the time between itineraries Itineraries without transit legs are excluded from this filter. Example: costLimitFunction(x) = 3600 + 2.0 x and intervalRelaxFactor = 0.5. If the lowest cost returned is 10 000, then the limit is set to: 3 600 + 2 * 10 000 = 26 600 plus half of the time between either departure or arrival times of the itinerary. Default: {"costLimitFunction": 900.0 + 1.5 x, "intervalRelaxFactor": 0.75} */
    transitGeneralizedCostLimit?: InputMaybe<TTransitGeneralizedCostFilterParams>
}

export type TJourneyPattern = {
    __typename?: 'JourneyPattern'
    directionType?: Maybe<TDirectionType>
    id: Scalars['ID']
    line: TLine
    name?: Maybe<Scalars['String']>
    notices: Array<TNotice>
    pointsOnLink?: Maybe<TPointsOnLink>
    /** Quays visited by service journeys for this journey patterns */
    quays: Array<TQuay>
    serviceJourneys: Array<TServiceJourney>
    /** List of service journeys for the journey pattern for a given date */
    serviceJourneysForDate: Array<TServiceJourney>
    /** Get all situations active for the journey pattern. */
    situations: Array<TPtSituationElement>
    /** Detailed path travelled by journey pattern divided into stop-to-stop sections. */
    stopToStopGeometries?: Maybe<Array<Maybe<TStopToStopGeometry>>>
}

export type TJourneyPatternServiceJourneysForDateArgs = {
    date?: InputMaybe<Scalars['Date']>
}

/** Part of a trip pattern. Either a ride on a public transport vehicle or access or path link to/from/between places */
export type TLeg = {
    __typename?: 'Leg'
    /** The aimed date and time this leg ends. */
    aimedEndTime: Scalars['DateTime']
    /** The aimed date and time this leg starts. */
    aimedStartTime: Scalars['DateTime']
    /** For ride legs, the service authority used for this legs. For non-ride legs, null. */
    authority?: Maybe<TAuthority>
    bikeRentalNetworks: Array<Maybe<Scalars['String']>>
    bookingArrangements?: Maybe<TBookingArrangement>
    /** The dated service journey used for this leg. */
    datedServiceJourney?: Maybe<TDatedServiceJourney>
    /** NOT IMPLEMENTED */
    directDuration: Scalars['Long']
    /** The distance traveled while traversing the leg in meters. */
    distance: Scalars['Float']
    /** The leg's duration in seconds */
    duration: Scalars['Long']
    /** The expected, realtime adjusted date and time this leg ends. */
    expectedEndTime: Scalars['DateTime']
    /** The expected, realtime adjusted date and time this leg starts. */
    expectedStartTime: Scalars['DateTime']
    /** EstimatedCall for the quay where the leg originates. */
    fromEstimatedCall?: Maybe<TEstimatedCall>
    /** The Place where the leg originates. */
    fromPlace: TPlace
    /** Generalized cost or weight of the leg. Used for debugging. */
    generalizedCost?: Maybe<Scalars['Int']>
    /** An identifier for the leg, which can be used to re-fetch the information. */
    id?: Maybe<Scalars['ID']>
    interchangeFrom?: Maybe<TInterchange>
    interchangeTo?: Maybe<TInterchange>
    /** For ride legs, estimated calls for quays between the Place where the leg originates and the Place where the leg ends. For non-ride legs, empty list. */
    intermediateEstimatedCalls: Array<TEstimatedCall>
    /** For ride legs, intermediate quays between the Place where the leg originates and the Place where the leg ends. For non-ride legs, empty list. */
    intermediateQuays: Array<TQuay>
    /** For ride legs, the line. For non-ride legs, null. */
    line?: Maybe<TLine>
    /** The mode of transport or access (e.g., foot) used when traversing this leg. */
    mode: TMode
    /** Fetch the next legs, which can be used to replace this leg. The replacement legs do arrive/depart from/to the same stop places. It might be necessary to change other legs in an itinerary in order to be able to ride the returned legs. */
    nextLegs?: Maybe<Array<TLeg>>
    /** For ride legs, the operator used for this legs. For non-ride legs, null. */
    operator?: Maybe<TOperator>
    /** The leg's geometry. */
    pointsOnLink?: Maybe<TPointsOnLink>
    /** Fetch the previous legs, which can be used to replace this leg. The replacement legs do arrive/depart from/to the same stop places. It might be necessary to change other legs in an itinerary in order to be able to ride the returned legs. */
    previousLegs?: Maybe<Array<TLeg>>
    /** Whether there is real-time data about this leg */
    realtime: Scalars['Boolean']
    /** Whether this leg is with a rented bike. */
    rentedBike?: Maybe<Scalars['Boolean']>
    /** Whether this leg is a ride leg or not. */
    ride: Scalars['Boolean']
    /** For transit legs, the service date of the trip. For non-transit legs, null. */
    serviceDate?: Maybe<Scalars['Date']>
    /** For ride legs, the service journey. For non-ride legs, null. */
    serviceJourney?: Maybe<TServiceJourney>
    /** For ride legs, all estimated calls for the service journey. For non-ride legs, empty list. */
    serviceJourneyEstimatedCalls: Array<TEstimatedCall>
    /** All relevant situations for this leg */
    situations: Array<TPtSituationElement>
    /** Do we continue from a specified via place */
    steps: Array<Maybe<TPathGuidance>>
    /** EstimatedCall for the quay where the leg ends. */
    toEstimatedCall?: Maybe<TEstimatedCall>
    /** The Place where the leg ends. */
    toPlace: TPlace
    /** The transport sub mode (e.g., localBus or expressBus) used when traversing this leg. Null if leg is not a ride */
    transportSubmode?: Maybe<TTransportSubmode>
    /** Whether this leg is walking with a bike. */
    walkingBike?: Maybe<Scalars['Boolean']>
}

/** Part of a trip pattern. Either a ride on a public transport vehicle or access or path link to/from/between places */
export type TLegNextLegsArgs = {
    filter?: InputMaybe<TAlternativeLegsFilter>
    next?: InputMaybe<Scalars['Int']>
}

/** Part of a trip pattern. Either a ride on a public transport vehicle or access or path link to/from/between places */
export type TLegPreviousLegsArgs = {
    filter?: InputMaybe<TAlternativeLegsFilter>
    previous?: InputMaybe<Scalars['Int']>
}

/** A group of routes which is generally known to the public by a similar name or number */
export type TLine = {
    __typename?: 'Line'
    authority?: Maybe<TAuthority>
    bikesAllowed?: Maybe<TBikesAllowed>
    /**
     * Booking arrangements for flexible line.
     * @deprecated BookingArrangements are defined per stop, and can be found under `passingTimes` or `estimatedCalls`
     */
    bookingArrangements?: Maybe<TBookingArrangement>
    branding?: Maybe<TBranding>
    description?: Maybe<Scalars['String']>
    /** Type of flexible line, or null if line is not flexible. */
    flexibleLineType?: Maybe<Scalars['String']>
    /** Groups of lines that line is a part of. */
    groupOfLines: Array<Maybe<TGroupOfLines>>
    id: Scalars['ID']
    journeyPatterns?: Maybe<Array<Maybe<TJourneyPattern>>>
    name?: Maybe<Scalars['String']>
    notices: Array<TNotice>
    operator?: Maybe<TOperator>
    presentation?: Maybe<TPresentation>
    /** Publicly announced code for line, differentiating it from other lines for the same operator. */
    publicCode?: Maybe<Scalars['String']>
    quays: Array<Maybe<TQuay>>
    serviceJourneys: Array<Maybe<TServiceJourney>>
    /** Get all situations active for the line. */
    situations: Array<TPtSituationElement>
    transportMode?: Maybe<TTransportMode>
    transportSubmode?: Maybe<TTransportSubmode>
    url?: Maybe<Scalars['String']>
}

export type TLocale = 'no' | 'us'

/** Input format for specifying a location through either a place reference (id), coordinates or both. If both place and coordinates are provided the place ref will be used if found, coordinates will only be used if place is not known. */
export type TLocation = {
    /** Coordinates for the location. This can be used alone or as fallback if the place id is not found. */
    coordinates?: InputMaybe<TInputCoordinates>
    /** The name of the location. This is pass-through informationand is not used in routing. */
    name?: InputMaybe<Scalars['String']>
    /** The id of an element in the OTP model. Currently supports Quay, StopPlace, multimodal StopPlace, and GroupOfStopPlaces. */
    place?: InputMaybe<Scalars['String']>
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
    language?: Maybe<Scalars['String']>
    value: Scalars['String']
}

export type TNotice = {
    __typename?: 'Notice'
    id: Scalars['ID']
    publicCode?: Maybe<Scalars['String']>
    text?: Maybe<Scalars['String']>
}

export type TOccupancyStatus =
    /** The vehicle or carriage has a few seats available. */
    | 'fewSeatsAvailable'
    /** The vehicle or carriage is considered full by most measures, but may still be allowing passengers to board. */
    | 'full'
    /** The vehicle or carriage has a large number of seats available. */
    | 'manySeatsAvailable'
    /** The vehicle or carriage doesn't have any occupancy data available. */
    | 'noData'
    /** The vehicle or carriage has no seats or standing room available. */
    | 'notAcceptingPassengers'
    /** The vehicle or carriage only has standing room available. */
    | 'standingRoomOnly'

/** Organisation providing public transport services. */
export type TOperator = {
    __typename?: 'Operator'
    id: Scalars['ID']
    lines: Array<Maybe<TLine>>
    name: Scalars['String']
    phone?: Maybe<Scalars['String']>
    serviceJourney: Array<Maybe<TServiceJourney>>
    url?: Maybe<Scalars['String']>
}

/** Information about pagination in a connection. */
export type TPageInfo = {
    __typename?: 'PageInfo'
    /** When paginating forwards, the cursor to continue. */
    endCursor?: Maybe<Scalars['String']>
    /** When paginating forwards, are there more items? */
    hasNextPage: Scalars['Boolean']
    /** When paginating backwards, are there more items? */
    hasPreviousPage: Scalars['Boolean']
    /** When paginating backwards, the cursor to continue. */
    startCursor?: Maybe<Scalars['String']>
}

/** A series of turn by turn instructions used for walking, biking and driving. */
export type TPathGuidance = {
    __typename?: 'PathGuidance'
    /** This step is on an open area, such as a plaza or train platform, and thus the directions should say something like "cross" */
    area?: Maybe<Scalars['Boolean']>
    /** The name of this street was generated by the system, so we should only display it once, and generally just display right/left directions */
    bogusName?: Maybe<Scalars['Boolean']>
    /** The distance in meters that this step takes. */
    distance?: Maybe<Scalars['Float']>
    /** When exiting a highway or traffic circle, the exit name/number. */
    exit?: Maybe<Scalars['String']>
    /** The absolute direction of this step. */
    heading?: Maybe<TAbsoluteDirection>
    /** The latitude of the step. */
    latitude?: Maybe<Scalars['Float']>
    /** The longitude of the step. */
    longitude?: Maybe<Scalars['Float']>
    /** The relative direction of this step. */
    relativeDirection?: Maybe<TRelativeDirection>
    /** Indicates whether or not a street changes direction at an intersection. */
    stayOn?: Maybe<Scalars['Boolean']>
    /** The name of the street. */
    streetName?: Maybe<Scalars['String']>
}

/** Common super class for all places (stop places, quays, car parks, bike parks and bike rental stations ) */
export type TPlace = {
    __typename?: 'Place'
    /** The bike rental station related to the place */
    bikeRentalStation?: Maybe<TBikeRentalStation>
    /** The flexible area related to the place. */
    flexibleArea?: Maybe<Scalars['Coordinates']>
    /** The latitude of the place. */
    latitude: Scalars['Float']
    /** The longitude of the place. */
    longitude: Scalars['Float']
    /** For transit quays, the name of the quay. For points of interest, the name of the POI. */
    name?: Maybe<Scalars['String']>
    /** The quay related to the place. */
    quay?: Maybe<TQuay>
    /** The rental vehicle related to the place */
    rentalVehicle?: Maybe<TRentalVehicle>
    /** Type of vertex. (Normal, Bike sharing station, Bike P+R, Transit quay) Mostly used for better localization of bike sharing and P+R station names */
    vertexType?: Maybe<TVertexType>
}

export type TPlaceAtDistance = {
    __typename?: 'PlaceAtDistance'
    distance?: Maybe<Scalars['Float']>
    /** @deprecated Id is not referable or meaningful and will be removed */
    id: Scalars['ID']
    place?: Maybe<TPlaceInterface>
}

/** Interface for places, i.e. quays, stop places, parks */
export type TPlaceInterface = {
    id: Scalars['ID']
    latitude?: Maybe<Scalars['Float']>
    longitude?: Maybe<Scalars['Float']>
}

/** A list of coordinates encoded as a polyline string (see http://code.google.com/apis/maps/documentation/polylinealgorithm.html) */
export type TPointsOnLink = {
    __typename?: 'PointsOnLink'
    /** The number of points in the string */
    length?: Maybe<Scalars['Int']>
    /** The encoded points of the polyline. Be aware that the string could contain escape characters that need to be accounted for. (https://www.freeformatter.com/javascript-escape.html) */
    points?: Maybe<Scalars['String']>
}

/** Types describing common presentation properties */
export type TPresentation = {
    __typename?: 'Presentation'
    colour?: Maybe<Scalars['String']>
    textColour?: Maybe<Scalars['String']>
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
    authority?: Maybe<TAuthority>
    /** Timestamp for when the situation was created. */
    creationTime?: Maybe<Scalars['DateTime']>
    /** Description of situation in all different translations available */
    description: Array<TMultilingualString>
    id: Scalars['ID']
    /** Optional links to more information. */
    infoLinks?: Maybe<Array<TInfoLink>>
    /** @deprecated Use affects instead */
    lines: Array<Maybe<TLine>>
    /** Codespace of the data source. */
    participant?: Maybe<Scalars['String']>
    /** Priority of this situation  */
    priority?: Maybe<Scalars['Int']>
    /** @deprecated Use affects instead */
    quays: Array<TQuay>
    /**
     * Authority that reported this situation. Always returns the first agency in the codespace
     * @deprecated Not yet officially supported. May be removed or renamed.
     */
    reportAuthority?: Maybe<TAuthority>
    /** ReportType of this situation */
    reportType?: Maybe<TReportType>
    /** @deprecated Use affects instead */
    serviceJourneys: Array<Maybe<TServiceJourney>>
    /** Severity of this situation  */
    severity?: Maybe<TSeverity>
    /** Operator's internal id for this situation */
    situationNumber?: Maybe<Scalars['String']>
    /** @deprecated Use affects instead */
    stopPlaces: Array<TStopPlace>
    /** Summary of situation in all different translations available */
    summary: Array<TMultilingualString>
    /** Period this situation is in effect */
    validityPeriod?: Maybe<TValidityPeriod>
    /** Timestamp when the situation element was updated. */
    versionedAtTime?: Maybe<Scalars['DateTime']>
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
    description?: Maybe<Scalars['String']>
    /** List of visits to this quay as part of vehicle journeys. */
    estimatedCalls: Array<TEstimatedCall>
    /** Geometry for flexible area. */
    flexibleArea?: Maybe<Scalars['Coordinates']>
    /** the Quays part of an flexible group. */
    flexibleGroup?: Maybe<Array<Maybe<TQuay>>>
    id: Scalars['ID']
    /** List of journey patterns servicing this quay */
    journeyPatterns: Array<Maybe<TJourneyPattern>>
    latitude?: Maybe<Scalars['Float']>
    /** List of lines servicing this quay */
    lines: Array<TLine>
    longitude?: Maybe<Scalars['Float']>
    name: Scalars['String']
    /** Public code used to identify this quay within the stop place. For instance a platform code. */
    publicCode?: Maybe<Scalars['String']>
    /** Get all situations active for the quay. */
    situations: Array<TPtSituationElement>
    /** The stop place to which this quay belongs to. */
    stopPlace?: Maybe<TStopPlace>
    stopType?: Maybe<Scalars['String']>
    tariffZones: Array<Maybe<TTariffZone>>
    timeZone?: Maybe<Scalars['String']>
    /** Whether this quay is suitable for wheelchair boarding. */
    wheelchairAccessible?: Maybe<TWheelchairBoarding>
}

/** A place such as platform, stance, or quayside where passengers have access to PT vehicles. */
export type TQuayEstimatedCallsArgs = {
    arrivalDeparture?: InputMaybe<TArrivalDeparture>
    includeCancelledTrips?: InputMaybe<Scalars['Boolean']>
    numberOfDepartures?: InputMaybe<Scalars['Int']>
    numberOfDeparturesPerLineAndDestinationDisplay?: InputMaybe<Scalars['Int']>
    startTime?: InputMaybe<Scalars['DateTime']>
    timeRange?: InputMaybe<Scalars['Int']>
    whiteListed?: InputMaybe<TInputWhiteListed>
    whiteListedModes?: InputMaybe<Array<InputMaybe<TTransportMode>>>
}

/** A place such as platform, stance, or quayside where passengers have access to PT vehicles. */
export type TQuayNameArgs = {
    lang?: InputMaybe<Scalars['String']>
}

export type TQuayAtDistance = {
    __typename?: 'QuayAtDistance'
    /** The distance in meters to the given quay. */
    distance?: Maybe<Scalars['Float']>
    id: Scalars['ID']
    quay?: Maybe<TQuay>
}

export type TQueryType = {
    __typename?: 'QueryType'
    /** Get all authorities */
    authorities: Array<Maybe<TAuthority>>
    /** Get an authority by ID */
    authority?: Maybe<TAuthority>
    /** Get a single bike park based on its id */
    bikePark?: Maybe<TBikePark>
    /** Get all bike parks */
    bikeParks: Array<Maybe<TBikePark>>
    /** Get all bike rental stations */
    bikeRentalStation?: Maybe<TBikeRentalStation>
    /** Get all bike rental stations */
    bikeRentalStations: Array<Maybe<TBikeRentalStation>>
    /** Get all bike rental stations within the specified bounding box. */
    bikeRentalStationsByBbox: Array<Maybe<TBikeRentalStation>>
    /** Get a single dated service journey based on its id */
    datedServiceJourney?: Maybe<TDatedServiceJourney>
    /** Get all dated service journeys, matching the filters */
    datedServiceJourneys: Array<TDatedServiceJourney>
    /** Get a single group of lines based on its id */
    groupOfLines?: Maybe<TGroupOfLines>
    /** Get all groups of lines */
    groupsOfLines: Array<TGroupOfLines>
    /** Refetch a single leg based on its id */
    leg?: Maybe<TLeg>
    /** Get a single line based on its id */
    line?: Maybe<TLine>
    /** Get all lines */
    lines: Array<Maybe<TLine>>
    /** Get all places (quays, stop places, car parks etc. with coordinates) within the specified radius from a location. The returned type has two fields place and distance. The search is done by walking so the distance is according to the network of walkables. */
    nearest?: Maybe<TPlaceAtDistanceConnection>
    /** Get a operator by ID */
    operator?: Maybe<TOperator>
    /** Get all operators */
    operators: Array<Maybe<TOperator>>
    /** Get a single quay based on its id) */
    quay?: Maybe<TQuay>
    /** Get all quays */
    quays: Array<Maybe<TQuay>>
    /** Get all quays within the specified bounding box */
    quaysByBbox: Array<Maybe<TQuay>>
    /** Get all quays within the specified walking radius from a location. The returned type has two fields quay and distance */
    quaysByRadius?: Maybe<TQuayAtDistanceConnection>
    /** Get default routing parameters. */
    routingParameters?: Maybe<TRoutingParameters>
    /** Get OTP server information */
    serverInfo: TServerInfo
    /** Get a single service journey based on its id */
    serviceJourney?: Maybe<TServiceJourney>
    /** Get all service journeys */
    serviceJourneys: Array<Maybe<TServiceJourney>>
    /** Get a single situation based on its situationNumber */
    situation?: Maybe<TPtSituationElement>
    /** Get all active situations. */
    situations: Array<TPtSituationElement>
    /** Get a single stopPlace based on its id) */
    stopPlace?: Maybe<TStopPlace>
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
    id: Scalars['String']
}

export type TQueryTypeBikeParkArgs = {
    id: Scalars['String']
}

export type TQueryTypeBikeRentalStationArgs = {
    id: Scalars['String']
}

export type TQueryTypeBikeRentalStationsArgs = {
    ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type TQueryTypeBikeRentalStationsByBboxArgs = {
    maximumLatitude?: InputMaybe<Scalars['Float']>
    maximumLongitude?: InputMaybe<Scalars['Float']>
    minimumLatitude?: InputMaybe<Scalars['Float']>
    minimumLongitude?: InputMaybe<Scalars['Float']>
}

export type TQueryTypeDatedServiceJourneyArgs = {
    id?: InputMaybe<Scalars['String']>
}

export type TQueryTypeDatedServiceJourneysArgs = {
    alterations?: InputMaybe<Array<TServiceAlteration>>
    authorities?: InputMaybe<Array<Scalars['String']>>
    lines?: InputMaybe<Array<Scalars['String']>>
    operatingDays: Array<Scalars['Date']>
    privateCodes?: InputMaybe<Array<Scalars['String']>>
    replacementFor?: InputMaybe<Array<Scalars['String']>>
    serviceJourneys?: InputMaybe<Array<Scalars['String']>>
}

export type TQueryTypeGroupOfLinesArgs = {
    id: Scalars['String']
}

export type TQueryTypeLegArgs = {
    id: Scalars['ID']
}

export type TQueryTypeLineArgs = {
    id: Scalars['ID']
}

export type TQueryTypeLinesArgs = {
    authorities?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
    flexibleOnly?: InputMaybe<Scalars['Boolean']>
    ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
    name?: InputMaybe<Scalars['String']>
    publicCode?: InputMaybe<Scalars['String']>
    publicCodes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
    transportModes?: InputMaybe<Array<InputMaybe<TTransportMode>>>
}

export type TQueryTypeNearestArgs = {
    after?: InputMaybe<Scalars['String']>
    before?: InputMaybe<Scalars['String']>
    filterByIds?: InputMaybe<TInputPlaceIds>
    filterByInUse?: InputMaybe<Scalars['Boolean']>
    filterByModes?: InputMaybe<Array<InputMaybe<TTransportMode>>>
    filterByPlaceTypes?: InputMaybe<Array<InputMaybe<TFilterPlaceType>>>
    first?: InputMaybe<Scalars['Int']>
    last?: InputMaybe<Scalars['Int']>
    latitude: Scalars['Float']
    longitude: Scalars['Float']
    maximumDistance?: Scalars['Float']
    maximumResults?: InputMaybe<Scalars['Int']>
    multiModalMode?: InputMaybe<TMultiModalMode>
}

export type TQueryTypeOperatorArgs = {
    id: Scalars['String']
}

export type TQueryTypeQuayArgs = {
    id: Scalars['String']
}

export type TQueryTypeQuaysArgs = {
    ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
    name?: InputMaybe<Scalars['String']>
}

export type TQueryTypeQuaysByBboxArgs = {
    authority?: InputMaybe<Scalars['String']>
    filterByInUse?: InputMaybe<Scalars['Boolean']>
    maximumLatitude: Scalars['Float']
    maximumLongitude: Scalars['Float']
    minimumLatitude: Scalars['Float']
    minimumLongitude: Scalars['Float']
}

export type TQueryTypeQuaysByRadiusArgs = {
    after?: InputMaybe<Scalars['String']>
    authority?: InputMaybe<Scalars['String']>
    before?: InputMaybe<Scalars['String']>
    first?: InputMaybe<Scalars['Int']>
    last?: InputMaybe<Scalars['Int']>
    latitude: Scalars['Float']
    longitude: Scalars['Float']
    radius: Scalars['Float']
}

export type TQueryTypeServiceJourneyArgs = {
    id: Scalars['String']
}

export type TQueryTypeServiceJourneysArgs = {
    activeDates?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>
    authorities?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
    lines?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
    privateCodes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type TQueryTypeSituationArgs = {
    situationNumber: Scalars['String']
}

export type TQueryTypeSituationsArgs = {
    codespaces?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
    severities?: InputMaybe<Array<InputMaybe<TSeverity>>>
}

export type TQueryTypeStopPlaceArgs = {
    id: Scalars['String']
}

export type TQueryTypeStopPlacesArgs = {
    ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type TQueryTypeStopPlacesByBboxArgs = {
    authority?: InputMaybe<Scalars['String']>
    filterByInUse?: InputMaybe<Scalars['Boolean']>
    maximumLatitude: Scalars['Float']
    maximumLongitude: Scalars['Float']
    minimumLatitude: Scalars['Float']
    minimumLongitude: Scalars['Float']
    multiModalMode?: InputMaybe<TMultiModalMode>
}

export type TQueryTypeTripArgs = {
    alightSlackDefault?: InputMaybe<Scalars['Int']>
    alightSlackList?: InputMaybe<Array<InputMaybe<TTransportModeSlack>>>
    arriveBy?: InputMaybe<Scalars['Boolean']>
    banned?: InputMaybe<TInputBanned>
    bicycleOptimisationMethod?: InputMaybe<TBicycleOptimisationMethod>
    bikeSpeed?: InputMaybe<Scalars['Float']>
    boardSlackDefault?: InputMaybe<Scalars['Int']>
    boardSlackList?: InputMaybe<Array<InputMaybe<TTransportModeSlack>>>
    dateTime?: InputMaybe<Scalars['DateTime']>
    debugItineraryFilter?: InputMaybe<Scalars['Boolean']>
    extraSearchCoachReluctance?: InputMaybe<Scalars['Float']>
    filters?: InputMaybe<Array<TTripFilterInput>>
    from: TLocation
    ignoreRealtimeUpdates?: InputMaybe<Scalars['Boolean']>
    includePlannedCancellations?: InputMaybe<Scalars['Boolean']>
    includeRealtimeCancellations?: InputMaybe<Scalars['Boolean']>
    itineraryFilters?: InputMaybe<TItineraryFilters>
    locale?: InputMaybe<TLocale>
    maxAccessEgressDurationForMode?: InputMaybe<Array<TStreetModeDurationInput>>
    maximumAdditionalTransfers?: InputMaybe<Scalars['Int']>
    maximumTransfers?: InputMaybe<Scalars['Int']>
    modes?: InputMaybe<TModes>
    numTripPatterns?: InputMaybe<Scalars['Int']>
    pageCursor?: InputMaybe<Scalars['String']>
    relaxTransitSearchGeneralizedCostAtDestination?: InputMaybe<
        Scalars['Float']
    >
    searchWindow?: InputMaybe<Scalars['Int']>
    timetableView?: InputMaybe<Scalars['Boolean']>
    to: TLocation
    transferPenalty?: InputMaybe<Scalars['Int']>
    transferSlack?: InputMaybe<Scalars['Int']>
    triangleFactors?: InputMaybe<TTriangleFactors>
    useBikeRentalAvailabilityInformation?: InputMaybe<Scalars['Boolean']>
    waitReluctance?: InputMaybe<Scalars['Float']>
    walkReluctance?: InputMaybe<Scalars['Float']>
    walkSpeed?: InputMaybe<Scalars['Float']>
    wheelchairAccessible?: InputMaybe<Scalars['Boolean']>
    whiteListed?: InputMaybe<TInputWhiteListed>
}

export type TQueryTypeViaTripArgs = {
    dateTime?: InputMaybe<Scalars['DateTime']>
    from: TLocation
    locale?: InputMaybe<TLocale>
    numTripPatterns?: InputMaybe<Scalars['Int']>
    pageCursor?: InputMaybe<Scalars['String']>
    searchWindow: Scalars['Duration']
    segments?: InputMaybe<Array<TViaSegmentInput>>
    to: TLocation
    via: Array<TViaLocationInput>
    wheelchairAccessible?: InputMaybe<Scalars['Boolean']>
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

export type TRentalVehicle = TPlaceInterface & {
    __typename?: 'RentalVehicle'
    currentRangeMeters?: Maybe<Scalars['Float']>
    id: Scalars['ID']
    latitude: Scalars['Float']
    longitude: Scalars['Float']
    network: Scalars['String']
    vehicleType: TRentalVehicleType
}

export type TRentalVehicleType = {
    __typename?: 'RentalVehicleType'
    formFactor: Scalars['String']
    maxRangeMeters?: Maybe<Scalars['Float']>
    name?: Maybe<Scalars['String']>
    propulsionType: Scalars['String']
    vehicleTypeId: Scalars['String']
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
    description: Scalars['String']
    /** An enum describing the field which should be changed, in order for the search to succeed */
    inputField?: Maybe<TInputField>
}

export type TRoutingErrorCode =
    /** The specified location is not close to any streets or transit stops */
    | 'locationNotFound'
    /** No stops are reachable from the location specified. You can try searching using a different access or egress mode */
    | 'noStopsInRange'
    /** No transit connection was found between the origin and destination withing the operating day or the next day */
    | 'noTransitConnection'
    /** Transit connection was found, but it was outside the search window, see metadata for the next search window */
    | 'noTransitConnectionInSearchWindow'
    /** The coordinates are outside the bounds of the data currently loaded into the system */
    | 'outsideBounds'
    /** The date specified is outside the range of data currently loaded into the system */
    | 'outsideServicePeriod'
    /** An unknown error happened during the search. The details have been logged to the server logs */
    | 'systemError'
    /** The origin and destination are so close to each other, that walking is always better, but no direct mode was specified for the search */
    | 'walkingBetterThanTransit'

/** The default parameters used in travel searches. */
export type TRoutingParameters = {
    __typename?: 'RoutingParameters'
    /** The alightSlack is the minimum extra time after exiting a public transport vehicle. This is the default value used, if not overridden by the 'alightSlackList'. */
    alightSlackDefault?: Maybe<Scalars['Int']>
    /** List of alightSlack for a given set of modes. */
    alightSlackList?: Maybe<Array<Maybe<TTransportModeSlackType>>>
    /** @deprecated Rental is specified by modes */
    allowBikeRental?: Maybe<Scalars['Boolean']>
    /** Separate cost for boarding a vehicle with a bicycle, which is more difficult than on foot. */
    bikeBoardCost?: Maybe<Scalars['Int']>
    /** Cost to park a bike. */
    bikeParkCost?: Maybe<Scalars['Int']>
    /** Time to park a bike. */
    bikeParkTime?: Maybe<Scalars['Int']>
    /** Cost to drop-off a rented bike. */
    bikeRentalDropOffCost?: Maybe<Scalars['Int']>
    /** Time to drop-off a rented bike. */
    bikeRentalDropOffTime?: Maybe<Scalars['Int']>
    /** Cost to rent a bike. */
    bikeRentalPickupCost?: Maybe<Scalars['Int']>
    /** Time to rent a bike. */
    bikeRentalPickupTime?: Maybe<Scalars['Int']>
    /** Max bike speed along streets, in meters per second */
    bikeSpeed?: Maybe<Scalars['Float']>
    /** The boardSlack is the minimum extra time to board a public transport vehicle. This is the same as the 'minimumTransferTime', except that this also apply to to the first transit leg in the trip. This is the default value used, if not overridden by the 'boardSlackList'. */
    boardSlackDefault?: Maybe<Scalars['Int']>
    /** List of boardSlack for a given set of modes. */
    boardSlackList?: Maybe<Array<Maybe<TTransportModeSlackType>>>
    /** The acceleration speed of an automobile, in meters per second per second. */
    carAccelerationSpeed?: Maybe<Scalars['Float']>
    /** The deceleration speed of an automobile, in meters per second per second. */
    carDecelerationSpeed?: Maybe<Scalars['Float']>
    /** Time to park a car in a park and ride, w/o taking into account driving and walking cost. */
    carDropOffTime?: Maybe<Scalars['Int']>
    /** Max car speed along streets, in meters per second */
    carSpeed?: Maybe<Scalars['Float']>
    /** @deprecated NOT IN USE IN OTP2. */
    compactLegsByReversedSearch?: Maybe<Scalars['Boolean']>
    debugItineraryFilter?: Maybe<Scalars['Boolean']>
    /**
     * Option to disable the default filtering of GTFS-RT alerts by time.
     * @deprecated This is not supported!
     */
    disableAlertFiltering?: Maybe<Scalars['Boolean']>
    /** If true, the remaining weight heuristic is disabled. */
    disableRemainingWeightHeuristic?: Maybe<Scalars['Boolean']>
    /** What is the cost of boarding a elevator? */
    elevatorBoardCost?: Maybe<Scalars['Int']>
    /** How long does it take to get on an elevator, on average. */
    elevatorBoardTime?: Maybe<Scalars['Int']>
    /** What is the cost of travelling one floor on an elevator? */
    elevatorHopCost?: Maybe<Scalars['Int']>
    /** How long does it take to advance one floor on an elevator? */
    elevatorHopTime?: Maybe<Scalars['Int']>
    /** Whether to apply the ellipsoid->geoid offset to all elevations in the response. */
    geoIdElevation?: Maybe<Scalars['Boolean']>
    /** When true, realtime updates are ignored during this search. */
    ignoreRealTimeUpdates?: Maybe<Scalars['Boolean']>
    /** When true, service journeys cancelled in scheduled route data will be included during this search. */
    includedPlannedCancellations?: Maybe<Scalars['Boolean']>
    /** @deprecated Parking is specified by modes */
    kissAndRide?: Maybe<Scalars['Boolean']>
    /** Maximum number of transfers allowed in addition to the result with least number of transfers */
    maxAdditionalTransfers?: Maybe<Scalars['Int']>
    /** This is the maximum duration in seconds for a direct street search. This is a performance limit and should therefore be set high. Use filters to limit what is presented to the client. */
    maxDirectStreetDuration?: Maybe<Scalars['Int']>
    /** The maximum slope of streets for wheelchair trips. */
    maxSlope?: Maybe<Scalars['Float']>
    /** Maximum number of transfers returned in a trip plan. */
    maxTransfers?: Maybe<Scalars['Int']>
    /** The maximum number of itineraries to return. */
    numItineraries?: Maybe<Scalars['Int']>
    /**
     * Accept only paths that use transit (no street-only paths).
     * @deprecated This is replaced by modes input object
     */
    onlyTransitTrips?: Maybe<Scalars['Boolean']>
    /** Penalty added for using every route that is not preferred if user set any route as preferred. We return number of seconds that we are willing to wait for preferred route. */
    otherThanPreferredRoutesPenalty?: Maybe<Scalars['Int']>
    /** @deprecated Parking is specified by modes */
    parkAndRide?: Maybe<Scalars['Boolean']>
    /** @deprecated NOT IN USE IN OTP2. */
    reverseOptimizeOnTheFly?: Maybe<Scalars['Boolean']>
    /**
     * Whether the planner should return intermediate stops lists for transit legs.
     * @deprecated This parameter is always enabled
     */
    showIntermediateStops?: Maybe<Scalars['Boolean']>
    /** Used instead of walkReluctance for stairs. */
    stairsReluctance?: Maybe<Scalars['Float']>
    /** An extra penalty added on transfers (i.e. all boardings except the first one). */
    transferPenalty?: Maybe<Scalars['Int']>
    /** A global minimum transfer time (in seconds) that specifies the minimum amount of time that must pass between exiting one transit vehicle and boarding another. */
    transferSlack?: Maybe<Scalars['Int']>
    /** Multiplicative factor on expected turning time. */
    turnReluctance?: Maybe<Scalars['Float']>
    /** How much worse is waiting for a transit vehicle than being on a transit vehicle, as a multiplier. */
    waitReluctance?: Maybe<Scalars['Float']>
    /** This prevents unnecessary transfers by adding a cost for boarding a vehicle. */
    walkBoardCost?: Maybe<Scalars['Int']>
    /** A multiplier for how bad walking is, compared to being in transit for equal lengths of time. */
    walkReluctance?: Maybe<Scalars['Float']>
    /** Max walk speed along streets, in meters per second */
    walkSpeed?: Maybe<Scalars['Float']>
    /** Whether the trip must be wheelchair accessible. */
    wheelChairAccessible?: Maybe<Scalars['Boolean']>
}

export type TServerInfo = {
    __typename?: 'ServerInfo'
    /** The 'configVersion' of the build-config.json file. */
    buildConfigVersion?: Maybe<Scalars['String']>
    /** OTP Build timestamp */
    buildTime?: Maybe<Scalars['String']>
    gitBranch?: Maybe<Scalars['String']>
    gitCommit?: Maybe<Scalars['String']>
    gitCommitTime?: Maybe<Scalars['String']>
    /** The 'configVersion' of the otp-config.json file. */
    otpConfigVersion?: Maybe<Scalars['String']>
    /** The otp-serialization-version-id used to check graphs for compatibility with current version of OTP. */
    otpSerializationVersionId?: Maybe<Scalars['String']>
    /** The 'configVersion' of the router-config.json file. */
    routerConfigVersion?: Maybe<Scalars['String']>
    /** Maven version */
    version?: Maybe<Scalars['String']>
}

export type TServiceAlteration =
    | 'cancellation'
    | 'extraJourney'
    | 'planned'
    | 'replaced'

/** A planned vehicle journey with passengers. */
export type TServiceJourney = {
    __typename?: 'ServiceJourney'
    activeDates: Array<Maybe<Scalars['Date']>>
    /** Whether bikes are allowed on service journey. */
    bikesAllowed?: Maybe<TBikesAllowed>
    /**
     * Booking arrangements for flexible services.
     * @deprecated BookingArrangements are defined per stop, and can be found under `passingTimes` or `estimatedCalls`
     */
    bookingArrangements?: Maybe<TBookingArrangement>
    directionType?: Maybe<TDirectionType>
    /** Returns scheduled passingTimes for this ServiceJourney for a given date, updated with realtime-updates (if available). NB! This takes a date as argument (default=today) and returns estimatedCalls for that date and should only be used if the date is known when creating the request. For fetching estimatedCalls for a given trip.leg, use leg.serviceJourneyEstimatedCalls instead. */
    estimatedCalls?: Maybe<Array<Maybe<TEstimatedCall>>>
    id: Scalars['ID']
    /** JourneyPattern for the service journey, according to scheduled data. If the ServiceJourney is not included in the scheduled data, null is returned. */
    journeyPattern?: Maybe<TJourneyPattern>
    line: TLine
    notices: Array<TNotice>
    operator?: Maybe<TOperator>
    /** Returns scheduled passing times only - without realtime-updates, for realtime-data use 'estimatedCalls' */
    passingTimes: Array<Maybe<TTimetabledPassingTime>>
    /** Detailed path travelled by service journey. Not available for flexible trips. */
    pointsOnLink?: Maybe<TPointsOnLink>
    /** For internal use by operators. */
    privateCode?: Maybe<Scalars['String']>
    /** Publicly announced code for service journey, differentiating it from other service journeys for the same line. */
    publicCode?: Maybe<Scalars['String']>
    /** Quays visited by service journey, according to scheduled data. If the ServiceJourney is not included in the scheduled data, an empty list is returned. */
    quays: Array<TQuay>
    /** @deprecated The service journey alteration will be moved out of SJ and grouped together with the SJ and date. In Netex this new type is called DatedServiceJourney. We will create artificial DSJs for the old SJs. */
    serviceAlteration?: Maybe<TServiceAlteration>
    /** Get all situations active for the service journey. */
    situations: Array<TPtSituationElement>
    transportMode?: Maybe<TTransportMode>
    transportSubmode?: Maybe<TTransportSubmode>
    /** Whether service journey is accessible with wheelchair. */
    wheelchairAccessible?: Maybe<TWheelchairBoarding>
}

/** A planned vehicle journey with passengers. */
export type TServiceJourneyEstimatedCallsArgs = {
    date?: InputMaybe<Scalars['Date']>
}

/** A planned vehicle journey with passengers. */
export type TServiceJourneyQuaysArgs = {
    first?: InputMaybe<Scalars['Int']>
    last?: InputMaybe<Scalars['Int']>
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
    description?: Maybe<Scalars['String']>
    /** List of visits to this stop place as part of vehicle journeys. */
    estimatedCalls: Array<TEstimatedCall>
    id: Scalars['ID']
    latitude?: Maybe<Scalars['Float']>
    longitude?: Maybe<Scalars['Float']>
    name: Scalars['String']
    /** Returns parent stop for this stop */
    parent?: Maybe<TStopPlace>
    /** Returns all quays that are children of this stop place */
    quays?: Maybe<Array<Maybe<TQuay>>>
    /** Get all situations active for the stop place. Situations affecting individual quays are not returned, and should be fetched directly from the quay. */
    situations: Array<TPtSituationElement>
    tariffZones: Array<Maybe<TTariffZone>>
    timeZone?: Maybe<Scalars['String']>
    /** The transport modes of quays under this stop place. */
    transportMode?: Maybe<Array<Maybe<TTransportMode>>>
    /** The transport submode serviced by this stop place. */
    transportSubmode?: Maybe<Array<Maybe<TTransportSubmode>>>
    /** Relative weighting of this stop with regards to interchanges. NOT IMPLEMENTED */
    weighting?: Maybe<TInterchangeWeighting>
}

/** Named place where public transport may be accessed. May be a building complex (e.g. a station) or an on-street location. */
export type TStopPlaceEstimatedCallsArgs = {
    arrivalDeparture?: InputMaybe<TArrivalDeparture>
    includeCancelledTrips?: InputMaybe<Scalars['Boolean']>
    numberOfDepartures?: InputMaybe<Scalars['Int']>
    numberOfDeparturesPerLineAndDestinationDisplay?: InputMaybe<Scalars['Int']>
    startTime?: InputMaybe<Scalars['DateTime']>
    timeRange?: InputMaybe<Scalars['Int']>
    whiteListed?: InputMaybe<TInputWhiteListed>
    whiteListedModes?: InputMaybe<Array<InputMaybe<TTransportMode>>>
}

/** Named place where public transport may be accessed. May be a building complex (e.g. a station) or an on-street location. */
export type TStopPlaceNameArgs = {
    lang?: InputMaybe<Scalars['String']>
}

/** Named place where public transport may be accessed. May be a building complex (e.g. a station) or an on-street location. */
export type TStopPlaceQuaysArgs = {
    filterByInUse?: InputMaybe<Scalars['Boolean']>
}

/** List of coordinates between two stops as a polyline */
export type TStopToStopGeometry = {
    __typename?: 'StopToStopGeometry'
    /** Origin Quay */
    fromQuay?: Maybe<TQuay>
    /** A list of coordinates encoded as a polyline string between two stops (see http://code.google.com/apis/maps/documentation/polylinealgorithm.html) */
    pointsOnLink?: Maybe<TPointsOnLink>
    /** Destination Quay */
    toQuay?: Maybe<TQuay>
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
    duration: Scalars['Duration']
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

/** A system notice is used to tag elements with system information for debugging or other system related purpose. One use-case is to run a routing search with 'itineraryFilters.debug: true'. This will then tag itineraries instead of removing them from the result. This make it possible to inspect the itinerary-filter-chain. A SystemNotice only have english text, because the primary user are technical staff, like testers and developers. */
export type TSystemNotice = {
    __typename?: 'SystemNotice'
    tag?: Maybe<Scalars['String']>
    text?: Maybe<Scalars['String']>
}

export type TTariffZone = {
    __typename?: 'TariffZone'
    id: Scalars['ID']
    name?: Maybe<Scalars['String']>
}

export type TTimeAndDayOffset = {
    __typename?: 'TimeAndDayOffset'
    /** Number of days offset from base line time */
    dayOffset?: Maybe<Scalars['Int']>
    /** Local time */
    time?: Maybe<Scalars['Time']>
}

/** Scheduled passing times. These are not affected by real time updates. */
export type TTimetabledPassingTime = {
    __typename?: 'TimetabledPassingTime'
    /** Scheduled time of arrival at quay */
    arrival?: Maybe<TTimeAndDayOffset>
    /** Booking arrangements for this passing time. */
    bookingArrangements?: Maybe<TBookingArrangement>
    /** Scheduled time of departure from quay */
    departure?: Maybe<TTimeAndDayOffset>
    destinationDisplay?: Maybe<TDestinationDisplay>
    /** Earliest possible departure time for a service journey with a service window. */
    earliestDepartureTime?: Maybe<TTimeAndDayOffset>
    /** Whether vehicle may be alighted at quay. */
    forAlighting: Scalars['Boolean']
    /** Whether vehicle may be boarded at quay. */
    forBoarding: Scalars['Boolean']
    /** Latest possible (planned) arrival time for a service journey with a service window. */
    latestArrivalTime?: Maybe<TTimeAndDayOffset>
    notices: Array<TNotice>
    quay: TQuay
    /** Whether vehicle will only stop on request. */
    requestStop: Scalars['Boolean']
    serviceJourney: TServiceJourney
    /** Whether this is a timing point or not. Boarding and alighting is not allowed at timing points. */
    timingPoint: Scalars['Boolean']
}

export type TTransitGeneralizedCostFilterParams = {
    costLimitFunction: Scalars['DoubleFunction']
    intervalRelaxFactor: Scalars['Float']
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
    | 'tram'
    | 'trolleybus'
    | 'unknown'
    | 'water'

/** Used to specify board and alight slack for a given modes. */
export type TTransportModeSlack = {
    /** List of modes for which the given slack apply. */
    modes: Array<TTransportMode>
    /** The slack used for all given modes. */
    slack: Scalars['Int']
}

/** Used to specify board and alight slack for a given modes. */
export type TTransportModeSlackType = {
    __typename?: 'TransportModeSlackType'
    modes: Array<TTransportMode>
    slack: Scalars['Int']
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
    safety: Scalars['Float']
    /** How important is slope/elevation expressed as a fraction of 1. */
    slope: Scalars['Float']
    /** How important is time expressed as a fraction of 1. Note that what this really optimises for is distance (even if that means going over terrible surfaces, so I might be slower than the safe route). */
    time: Scalars['Float']
}

/** Description of a travel between two places. */
export type TTrip = {
    __typename?: 'Trip'
    /** The time and date of travel */
    dateTime?: Maybe<Scalars['DateTime']>
    /** Information about the timings for the trip generation */
    debugOutput: TDebugOutput
    /** The origin */
    fromPlace: TPlace
    /**
     * A list of possible error messages as enum
     * @deprecated Use routingErrors instead
     */
    messageEnums: Array<Maybe<Scalars['String']>>
    /**
     * A list of possible error messages in cleartext
     * @deprecated Use routingErrors instead
     */
    messageStrings: Array<Maybe<Scalars['String']>>
    /** The trip request metadata. */
    metadata?: Maybe<TTripSearchData>
    /**
     * Use the cursor to get the next page of results. Use this cursor for the pageCursor parameter in the trip query in order to get the next page.
     * The next page is a set of itineraries departing AFTER the last itinerary in this result.
     */
    nextPageCursor?: Maybe<Scalars['String']>
    /**
     * Use the cursor to get the previous page of results. Use this cursor for the pageCursor parameter in the trip query in order to get the previous page.
     * The previous page is a set of itineraries departing BEFORE the first itinerary in this result.
     */
    previousPageCursor?: Maybe<Scalars['String']>
    /** A list of routing errors, and fields which caused them */
    routingErrors: Array<TRoutingError>
    /** The destination */
    toPlace: TPlace
    /** A list of possible trip patterns */
    tripPatterns: Array<TTripPattern>
}

/** Description of a travel between two places. */
export type TTripMessageStringsArgs = {
    language?: InputMaybe<Scalars['String']>
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
    authorities?: InputMaybe<Array<Scalars['ID']>>
    /** Set of ids for group of lines that should be included in/excluded from the search */
    groupOfLines?: InputMaybe<Array<Scalars['ID']>>
    /** Set of ids for lines that should be included in/excluded from search */
    lines?: InputMaybe<Array<Scalars['ID']>>
    /** Set of ids for service journeys that should be included in/excluded from search */
    serviceJourneys?: InputMaybe<Array<Scalars['ID']>>
    /** The allowed modes for the transit part of the trip. Use an empty list to disallow transit for this search. If the element is not present or null, it will default to all transport modes. */
    transportModes?: InputMaybe<Array<TTransportModes>>
}

/** List of legs constituting a suggested sequence of rides and links for a specific trip. */
export type TTripPattern = {
    __typename?: 'TripPattern'
    /** The aimed date and time the trip ends. */
    aimedEndTime: Scalars['DateTime']
    /** The aimed date and time the trip starts. */
    aimedStartTime: Scalars['DateTime']
    /** NOT IMPLEMENTED. */
    directDuration?: Maybe<Scalars['Long']>
    /** Total distance for the trip, in meters. NOT IMPLEMENTED */
    distance?: Maybe<Scalars['Float']>
    /** Duration of the trip, in seconds. */
    duration?: Maybe<Scalars['Long']>
    /**
     * Time that the trip arrives.
     * @deprecated Replaced with expectedEndTime
     */
    endTime?: Maybe<Scalars['DateTime']>
    /** The expected, realtime adjusted date and time the trip ends. */
    expectedEndTime: Scalars['DateTime']
    /** The expected, realtime adjusted date and time the trip starts. */
    expectedStartTime: Scalars['DateTime']
    /** Generalized cost or weight of the itinerary. Used for debugging. */
    generalizedCost?: Maybe<Scalars['Int']>
    /** A list of legs. Each leg is either a walking (cycling, car) portion of the trip, or a ride leg on a particular vehicle. So a trip where the use walks to the Q train, transfers to the 6, then walks to their destination, has four legs. */
    legs: Array<TLeg>
    /**
     * Time that the trip departs.
     * @deprecated Replaced with expectedStartTime
     */
    startTime?: Maybe<Scalars['DateTime']>
    /** Get all system notices. */
    systemNotices: Array<TSystemNotice>
    /** A cost calculated to favor transfer with higher priority. This field is meant for debugging only. */
    transferPriorityCost?: Maybe<Scalars['Int']>
    /** A cost calculated to distribute wait-time and avoid very short transfers. This field is meant for debugging only. */
    waitTimeOptimizedCost?: Maybe<Scalars['Int']>
    /** How much time is spent waiting for transit to arrive, in seconds. */
    waitingTime?: Maybe<Scalars['Long']>
    /** How far the user has to walk, in meters. */
    walkDistance?: Maybe<Scalars['Float']>
    /** How much time is spent walking, in seconds. */
    walkTime?: Maybe<Scalars['Long']>
}

/** Trips search metadata. */
export type TTripSearchData = {
    __typename?: 'TripSearchData'
    /**
     * This is the suggested search time for the "next page" or time window. Insert it together with the 'searchWindowUsed' in the request to get a new set of trips following in the time-window AFTER the current search.
     * @deprecated Use pageCursor instead
     */
    nextDateTime?: Maybe<Scalars['DateTime']>
    /**
     * This is the suggested search time for the "previous page" or time-window. Insert it together with the 'searchWindowUsed' in the request to get a new set of trips preceding in the time-window BEFORE the current search.
     * @deprecated Use pageCursor instead
     */
    prevDateTime?: Maybe<Scalars['DateTime']>
    /** This is the time window used by the raptor search. The input searchWindow is an optional parameter and is dynamically assigned if not set. OTP might override the value if it is too small or too large. When paging OTP adjusts it to the appropriate size, depending on the number of itineraries found in the current search window. The scaling of the search window ensures faster paging and limits resource usage. The unit is seconds. */
    searchWindowUsed: Scalars['Int']
}

export type TValidityPeriod = {
    __typename?: 'ValidityPeriod'
    /** End of validity period. Will return 'null' if validity is open-ended. */
    endTime?: Maybe<Scalars['DateTime']>
    /** Start of validity period */
    startTime?: Maybe<Scalars['DateTime']>
}

export type TVertexType = 'bikePark' | 'bikeShare' | 'normal' | 'transit'

/** An acceptable combination of trip patterns between two segments of the via search */
export type TViaConnection = {
    __typename?: 'ViaConnection'
    /** The index of the trip pattern in the segment before the via point */
    from?: Maybe<Scalars['Int']>
    /** The index of the trip pattern in the segment after the via point */
    to?: Maybe<Scalars['Int']>
}

/** Input format for specifying a location through either a place reference (id), coordinates or both. If both place and coordinates are provided the place ref will be used if found, coordinates will only be used if place is not known. The location also contain information about the minimum and maximum time the user is willing to stay at the via location. */
export type TViaLocationInput = {
    /** Coordinates for the location. This can be used alone or as fallback if the place id is not found. */
    coordinates?: InputMaybe<TInputCoordinates>
    /** The maximum time the user wants to stay in the via location before continuing his journey */
    maxSlack?: InputMaybe<Scalars['Duration']>
    /** The minimum time the user wants to stay in the via location before continuing his journey */
    minSlack?: InputMaybe<Scalars['Duration']>
    /** The name of the location. This is pass-through informationand is not used in routing. */
    name?: InputMaybe<Scalars['String']>
    /** The id of an element in the OTP model. Currently supports Quay, StopPlace, multimodal StopPlace, and GroupOfStopPlaces. */
    place?: InputMaybe<Scalars['String']>
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
    totalTime?: Maybe<Scalars['Long']>
}

export type TInfoLink = {
    __typename?: 'infoLink'
    /** Label */
    label?: Maybe<Scalars['String']>
    /** URI */
    uri: Scalars['String']
}

/** A connection to a list of items. */
export type TPlaceAtDistanceConnection = {
    __typename?: 'placeAtDistanceConnection'
    /** a list of edges */
    edges?: Maybe<Array<Maybe<TPlaceAtDistanceEdge>>>
    /** details about this specific page */
    pageInfo: TPageInfo
}

/** An edge in a connection */
export type TPlaceAtDistanceEdge = {
    __typename?: 'placeAtDistanceEdge'
    /** cursor marks a unique position or index into the connection */
    cursor: Scalars['String']
    /** The item at the end of the edge */
    node?: Maybe<TPlaceAtDistance>
}

/** A connection to a list of items. */
export type TQuayAtDistanceConnection = {
    __typename?: 'quayAtDistanceConnection'
    /** a list of edges */
    edges?: Maybe<Array<Maybe<TQuayAtDistanceEdge>>>
    /** details about this specific page */
    pageInfo: TPageInfo
}

/** An edge in a connection */
export type TQuayAtDistanceEdge = {
    __typename?: 'quayAtDistanceEdge'
    /** cursor marks a unique position or index into the connection */
    cursor: Scalars['String']
    /** The item at the end of the edge */
    node?: Maybe<TQuayAtDistance>
}
