import { Coordinates } from '../types/JourneyPlannerV3';
import { Date } from '../types/JourneyPlannerV3';
import { DateTime } from '../types/JourneyPlannerV3';
import { DoubleFunction } from '../types/JourneyPlannerV3';
import { LocalTime } from '../types/JourneyPlannerV3';
import { Long } from '../types/JourneyPlannerV3';
import { Time } from '../types/JourneyPlannerV3';
import { DocumentNode } from 'graphql';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Coordinates: Coordinates;
  Date: Date;
  DateTime: DateTime;
  DoubleFunction: DoubleFunction;
  Duration: any;
  LocalTime: LocalTime;
  Long: Long;
  Time: Time;
};

export enum AbsoluteDirection {
  East = 'east',
  North = 'north',
  Northeast = 'northeast',
  Northwest = 'northwest',
  South = 'south',
  Southeast = 'southeast',
  Southwest = 'southwest',
  West = 'west'
}

export enum AlternativeLegsFilter {
  NoFilter = 'noFilter',
  SameAuthority = 'sameAuthority',
  SameLine = 'sameLine',
  SameMode = 'sameMode'
}

export enum ArrivalDeparture {
  /** Only show arrivals */
  Arrivals = 'arrivals',
  /** Show both arrivals and departures */
  Both = 'both',
  /** Only show departures */
  Departures = 'departures'
}

/** Authority involved in public transportation. An organisation under which the responsibility of organising the transport service in a certain area is placed. */
export type Authority = {
  __typename?: 'Authority';
  fareUrl: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lang: Maybe<Scalars['String']>;
  lines: Array<Maybe<Line>>;
  name: Scalars['String'];
  phone: Maybe<Scalars['String']>;
  /** Get all situations active for the authority. */
  situations: Array<PtSituationElement>;
  timezone: Scalars['String'];
  url: Maybe<Scalars['String']>;
};

export enum BicycleOptimisationMethod {
  Flat = 'flat',
  Greenways = 'greenways',
  Quick = 'quick',
  Safe = 'safe',
  Triangle = 'triangle'
}

export type BikePark = PlaceInterface & {
  __typename?: 'BikePark';
  id: Scalars['ID'];
  latitude: Maybe<Scalars['Float']>;
  longitude: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  realtime: Maybe<Scalars['Boolean']>;
  spacesAvailable: Maybe<Scalars['Int']>;
};

export type BikeRentalStation = PlaceInterface & {
  __typename?: 'BikeRentalStation';
  allowDropoff: Maybe<Scalars['Boolean']>;
  bikesAvailable: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  latitude: Maybe<Scalars['Float']>;
  longitude: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  networks: Array<Maybe<Scalars['String']>>;
  realtimeOccupancyAvailable: Maybe<Scalars['Boolean']>;
  spacesAvailable: Maybe<Scalars['Int']>;
};

export enum BikesAllowed {
  /** The vehicle being used on this particular trip can accommodate at least one bicycle. */
  Allowed = 'allowed',
  /** There is no bike information for the trip. */
  NoInformation = 'noInformation',
  /** No bicycles are allowed on this trip. */
  NotAllowed = 'notAllowed'
}

export type BookingArrangement = {
  __typename?: 'BookingArrangement';
  /** Time constraints for booking */
  bookWhen: Maybe<PurchaseWhen>;
  /** Who should ticket be contacted for booking */
  bookingContact: Maybe<Contact>;
  /** How should service be booked? */
  bookingMethods: Maybe<Array<Maybe<BookingMethod>>>;
  /** Textual description of booking arrangement for service */
  bookingNote: Maybe<Scalars['String']>;
  /** How many days prior to the travel the service needs to be booked */
  latestBookingDay: Maybe<Scalars['Int']>;
  /** Latest time the service can be booked. ISO 8601 timestamp */
  latestBookingTime: Maybe<Scalars['LocalTime']>;
  /** Minimum period in advance service can be booked as a ISO 8601 duration */
  minimumBookingPeriod: Maybe<Scalars['String']>;
};

export enum BookingMethod {
  CallDriver = 'callDriver',
  CallOffice = 'callOffice',
  Online = 'online',
  PhoneAtStop = 'phoneAtStop',
  Text = 'text'
}

export type Branding = {
  __typename?: 'Branding';
  /** Description of branding. */
  description: Maybe<Scalars['String']>;
  id: Maybe<Scalars['ID']>;
  /** URL to an image be used for branding */
  image: Maybe<Scalars['String']>;
  /** Full name to be used for branding. */
  name: Maybe<Scalars['String']>;
  /** Short name to be used for branding. */
  shortName: Maybe<Scalars['String']>;
  /** URL to be used for branding */
  url: Maybe<Scalars['String']>;
};

export type Contact = {
  __typename?: 'Contact';
  /** Name of person to contact */
  contactPerson: Maybe<Scalars['String']>;
  /** Email adress for contact */
  email: Maybe<Scalars['String']>;
  /** Textual description of how to get in contact */
  furtherDetails: Maybe<Scalars['String']>;
  /** Phone number for contact */
  phone: Maybe<Scalars['String']>;
  /** Url for contact */
  url: Maybe<Scalars['String']>;
};

/** A planned journey on a specific day */
export type DatedServiceJourney = {
  __typename?: 'DatedServiceJourney';
  /** Returns scheduled passingTimes for this dated service journey, updated with realtime-updates (if available).  */
  estimatedCalls: Maybe<Array<Maybe<EstimatedCall>>>;
  id: Scalars['ID'];
  /** JourneyPattern for the dated service journey. */
  journeyPattern: Maybe<JourneyPattern>;
  /** The date this service runs. The date used is based on the service date as opposed to calendar date. */
  operatingDay: Maybe<Scalars['Date']>;
  /** Quays visited by the dated service journey. */
  quays: Array<Quay>;
  /** List of the dated service journeys this dated service journeys replaces */
  replacementFor: Array<DatedServiceJourney>;
  /** The service journey this Dated Service Journey is based on */
  serviceJourney: ServiceJourney;
  /** Alterations specified on the Trip in the planned data */
  tripAlteration: Maybe<ServiceAlteration>;
};


/** A planned journey on a specific day */
export type DatedServiceJourneyQuaysArgs = {
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

/** An advertised destination of a specific journey pattern, usually displayed on a head sign or at other on-board locations. */
export type DestinationDisplay = {
  __typename?: 'DestinationDisplay';
  /** Name of destination to show on front of vehicle. */
  frontText: Maybe<Scalars['String']>;
  /** Intermediary destinations which the vehicle will pass before reaching its final destination. */
  via: Maybe<Array<Maybe<Scalars['String']>>>;
};

export enum DirectionType {
  Anticlockwise = 'anticlockwise',
  Clockwise = 'clockwise',
  Inbound = 'inbound',
  Outbound = 'outbound',
  Unknown = 'unknown'
}

/** List of visits to quays as part of vehicle journeys. Updated with real time information where available */
export type EstimatedCall = {
  __typename?: 'EstimatedCall';
  /** Actual time of arrival at quay. Updated from real time information if available. NOT IMPLEMENTED */
  actualArrivalTime: Maybe<Scalars['DateTime']>;
  /** Actual time of departure from quay. Updated with real time information if available. NOT IMPLEMENTED */
  actualDepartureTime: Maybe<Scalars['DateTime']>;
  /** Scheduled time of arrival at quay. Not affected by read time updated */
  aimedArrivalTime: Scalars['DateTime'];
  /** Scheduled time of departure from quay. Not affected by read time updated */
  aimedDepartureTime: Scalars['DateTime'];
  /** Booking arrangements for this EstimatedCall. */
  bookingArrangements: Maybe<BookingArrangement>;
  /** Whether stop is cancelled. This means that either the ServiceJourney has a planned cancellation, the ServiceJourney has been cancelled by realtime data, or this particular StopPoint has been cancelled. This also means that both boarding and alighting has been cancelled. */
  cancellation: Scalars['Boolean'];
  /** The date the estimated call is valid for. */
  date: Maybe<Scalars['Date']>;
  datedServiceJourney: Maybe<DatedServiceJourney>;
  destinationDisplay: Maybe<DestinationDisplay>;
  /** Expected time of arrival at quay. Updated with real time information if available. Will be null if an actualArrivalTime exists */
  expectedArrivalTime: Scalars['DateTime'];
  /** Expected time of departure from quay. Updated with real time information if available. Will be null if an actualDepartureTime exists */
  expectedDepartureTime: Scalars['DateTime'];
  /** Whether vehicle may be alighted at quay according to the planned data. If the cancellation flag is set, alighting is not possible, even if this field is set to true. */
  forAlighting: Scalars['Boolean'];
  /** Whether vehicle may be boarded at quay according to the planned data. If the cancellation flag is set, boarding is not possible, even if this field is set to true. */
  forBoarding: Scalars['Boolean'];
  notices: Array<Notice>;
  occupancyStatus: OccupancyStatus;
  /** Whether the updated estimates are expected to be inaccurate. */
  predictionInaccurate: Scalars['Boolean'];
  quay: Maybe<Quay>;
  /** Whether this call has been updated with real time information. */
  realtime: Scalars['Boolean'];
  realtimeState: RealtimeState;
  /** Whether vehicle will only stop on request. */
  requestStop: Scalars['Boolean'];
  serviceJourney: Maybe<ServiceJourney>;
  /** Get all relevant situations for this EstimatedCall. */
  situations: Array<PtSituationElement>;
  stopPositionInPattern: Scalars['Int'];
  /** Whether this is a timing point or not. Boarding and alighting is not allowed at timing points. */
  timingPoint: Scalars['Boolean'];
};

export enum FilterPlaceType {
  /** Bicycle rent stations */
  BicycleRent = 'bicycleRent',
  /** Bike parks */
  BikePark = 'bikePark',
  /** Car parks */
  CarPark = 'carPark',
  /** Quay */
  Quay = 'quay',
  /** StopPlace */
  StopPlace = 'stopPlace'
}

/** Additional (optional) grouping of lines for particular purposes such as e.g. fare harmonisation or public presentation. */
export type GroupOfLines = {
  __typename?: 'GroupOfLines';
  /** Description of group of lines */
  description: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** All lines part of this group of lines */
  lines: Array<Line>;
  /** Full name for group of lines. */
  name: Maybe<Scalars['String']>;
  /** For internal use by operator/authority. */
  privateCode: Maybe<Scalars['String']>;
  /** Short name for group of lines. */
  shortName: Maybe<Scalars['String']>;
};

/** Filter trips by disallowing lines involving certain elements. If both lines and authorities are specified, only one must be valid for each line to be banned. If a line is both banned and whitelisted, it will be counted as banned. */
export type InputBanned = {
  /** Set of ids for authorities that should not be used */
  authorities?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Set of ids for lines that should not be used */
  lines?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** NOT IMPLEMENTED. Set of ids of quays that should not be allowed for boarding or alighting. Trip patterns that travel through the quay will still be permitted. */
  quays?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** NOT IMPLEMENTED. Set of ids of quays that should not be allowed for boarding, alighting or traveling thorugh. */
  quaysHard?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Set of ids of rental networks that should not be allowed for renting vehicles. */
  rentalNetworks?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Set of ids of service journeys that should not be used. */
  serviceJourneys?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

/** Input type for coordinates in the WGS84 system */
export type InputCoordinates = {
  /** The latitude of the place. */
  latitude: Scalars['Float'];
  /** The longitude of the place. */
  longitude: Scalars['Float'];
};

export enum InputField {
  DateTime = 'dateTime',
  From = 'from',
  To = 'to'
}

export type InputPlaceIds = {
  /** Bike parks to include by id. */
  bikeParks?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Bike rentals to include by id. */
  bikeRentalStations?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Car parks to include by id. */
  carParks?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Lines to include by id. */
  lines?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Quays to include by id. */
  quays?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** Filter trips by only allowing lines involving certain elements. If both lines and authorities are specified, only one must be valid for each line to be used. If a line is both banned and whitelisted, it will be counted as banned. */
export type InputWhiteListed = {
  /** Set of ids for authorities that should be used */
  authorities?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Set of ids for lines that should be used */
  lines?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  /** Set of ids of rental networks that should be used for renting vehicles. */
  rentalNetworks?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type Interchange = {
  __typename?: 'Interchange';
  /** @deprecated This is the same as using the `fromServiceJourney { line }` field. */
  FromLine: Maybe<Line>;
  /** @deprecated Use fromServiceJourney instead */
  FromServiceJourney: Maybe<ServiceJourney>;
  /** @deprecated This is the same as using the `toServiceJourney { line }` field. */
  ToLine: Maybe<Line>;
  /** @deprecated Use toServiceJourney instead */
  ToServiceJourney: Maybe<ServiceJourney>;
  fromServiceJourney: Maybe<ServiceJourney>;
  guaranteed: Maybe<Scalars['Boolean']>;
  /** Maximum time after scheduled departure time the connecting transport is guarantied to wait for the delayed trip. [NOT RESPECTED DURING ROUTING, JUST PASSED THROUGH] */
  maximumWaitTime: Maybe<Scalars['Int']>;
  /** The transfer priority is used to decide where a transfer should happen, at the highest prioritized location. If the guarantied flag is set it take precedence priority. A guarantied ALLOWED transfer is preferred over a PREFERRED none-guarantied transfer. */
  priority: Maybe<InterchangePriority>;
  staySeated: Maybe<Scalars['Boolean']>;
  toServiceJourney: Maybe<ServiceJourney>;
};

export enum InterchangePriority {
  Allowed = 'allowed',
  NotAllowed = 'notAllowed',
  Preferred = 'preferred',
  Recommended = 'recommended'
}

export enum InterchangeWeighting {
  /** Third highest priority interchange. */
  InterchangeAllowed = 'interchangeAllowed',
  /** Interchange not allowed. */
  NoInterchange = 'noInterchange',
  /** Highest priority interchange. */
  PreferredInterchange = 'preferredInterchange',
  /** Second highest priority interchange. */
  RecommendedInterchange = 'recommendedInterchange'
}

/** Parameters for the OTP Itinerary Filter Chain. These parameters SHOULD be configured on the server side and should not be used by the client. They are made available here to be able to experiment and tune the server. */
export type ItineraryFilters = {
  /** Pick ONE itinerary from each group after putting itineraries that is 85% similar together. */
  groupSimilarityKeepOne?: InputMaybe<Scalars['Float']>;
  /** Reduce the number of itineraries in each group to to maximum 3 itineraries. The itineraries are grouped by similar legs (on board same journey). So, if  68% of the distance is traveled by similar legs, then two itineraries are in the same group. Default value is 68%, must be at least 50%. */
  groupSimilarityKeepThree?: InputMaybe<Scalars['Float']>;
  /** Of the itineraries grouped to maximum of three itineraries, how much worse can the non-grouped legs be compared to the lowest cost. 2.0 means that they can be double the cost, and any itineraries having a higher cost will be filtered. Default value is 2.0, use a value lower than 1.0 to turn off */
  groupedOtherThanSameLegsMaxCostMultiplier?: InputMaybe<Scalars['Float']>;
  /** Set a relative limit for all transit itineraries. The limit is calculated based on the transit itinerary generalized-cost and the time between itineraries Itineraries without transit legs are excluded from this filter. Example: costLimitFunction(x) = 3600 + 2.0 x and intervalRelaxFactor = 0.5. If the lowest cost returned is 10 000, then the limit is set to: 3 600 + 2 * 10 000 = 26 600 plus half of the time between either departure or arrival times of the itinerary. Default: {"costLimitFunction": 900.0 + 1.5 x, "intervalRelaxFactor": 0.4} */
  transitGeneralizedCostLimit?: InputMaybe<TransitGeneralizedCostFilterParams>;
};

export type JourneyPattern = {
  __typename?: 'JourneyPattern';
  directionType: Maybe<DirectionType>;
  id: Scalars['ID'];
  line: Line;
  name: Maybe<Scalars['String']>;
  notices: Array<Notice>;
  pointsOnLink: Maybe<PointsOnLink>;
  /** Quays visited by service journeys for this journey patterns */
  quays: Array<Quay>;
  serviceJourneys: Array<ServiceJourney>;
  /** List of service journeys for the journey pattern for a given date */
  serviceJourneysForDate: Array<ServiceJourney>;
  /** Get all situations active for the journey pattern. */
  situations: Array<PtSituationElement>;
  /** Detailed path travelled by journey pattern divided into stop-to-stop sections. */
  stopToStopGeometries: Maybe<Array<Maybe<StopToStopGeometry>>>;
};


export type JourneyPatternServiceJourneysForDateArgs = {
  date?: InputMaybe<Scalars['Date']>;
};

/** Part of a trip pattern. Either a ride on a public transport vehicle or access or path link to/from/between places */
export type Leg = {
  __typename?: 'Leg';
  /** The aimed date and time this leg ends. */
  aimedEndTime: Scalars['DateTime'];
  /** The aimed date and time this leg starts. */
  aimedStartTime: Scalars['DateTime'];
  /** For ride legs, the service authority used for this legs. For non-ride legs, null. */
  authority: Maybe<Authority>;
  bikeRentalNetworks: Array<Maybe<Scalars['String']>>;
  bookingArrangements: Maybe<BookingArrangement>;
  /** The dated service journey used for this leg. */
  datedServiceJourney: Maybe<DatedServiceJourney>;
  /** NOT IMPLEMENTED */
  directDuration: Scalars['Long'];
  /** The distance traveled while traversing the leg in meters. */
  distance: Scalars['Float'];
  /** The leg's duration in seconds */
  duration: Scalars['Long'];
  /** The expected, realtime adjusted date and time this leg ends. */
  expectedEndTime: Scalars['DateTime'];
  /** The expected, realtime adjusted date and time this leg starts. */
  expectedStartTime: Scalars['DateTime'];
  /** EstimatedCall for the quay where the leg originates. */
  fromEstimatedCall: Maybe<EstimatedCall>;
  /** The Place where the leg originates. */
  fromPlace: Place;
  /** Generalized cost or weight of the leg. Used for debugging. */
  generalizedCost: Maybe<Scalars['Int']>;
  /** An identifier for the leg, which can be used to re-fetch the information. */
  id: Maybe<Scalars['ID']>;
  interchangeFrom: Maybe<Interchange>;
  interchangeTo: Maybe<Interchange>;
  /** For ride legs, estimated calls for quays between the Place where the leg originates and the Place where the leg ends. For non-ride legs, empty list. */
  intermediateEstimatedCalls: Array<EstimatedCall>;
  /** For ride legs, intermediate quays between the Place where the leg originates and the Place where the leg ends. For non-ride legs, empty list. */
  intermediateQuays: Array<Quay>;
  /** For ride legs, the line. For non-ride legs, null. */
  line: Maybe<Line>;
  /** The mode of transport or access (e.g., foot) used when traversing this leg. */
  mode: Mode;
  /** Fetch the next legs, which can be used to replace this leg. The replacement legs do arrive/depart from/to the same stop places. It might be necessary to change other legs in an itinerary in order to be able to ride the returned legs. */
  nextLegs: Maybe<Array<Leg>>;
  /** For ride legs, the operator used for this legs. For non-ride legs, null. */
  operator: Maybe<Operator>;
  /** The leg's geometry. */
  pointsOnLink: Maybe<PointsOnLink>;
  /** Fetch the previous legs, which can be used to replace this leg. The replacement legs do arrive/depart from/to the same stop places. It might be necessary to change other legs in an itinerary in order to be able to ride the returned legs. */
  previousLegs: Maybe<Array<Leg>>;
  /** Whether there is real-time data about this leg */
  realtime: Scalars['Boolean'];
  /** Whether this leg is with a rented bike. */
  rentedBike: Maybe<Scalars['Boolean']>;
  /** Whether this leg is a ride leg or not. */
  ride: Scalars['Boolean'];
  /** For transit legs, the service date of the trip. For non-transit legs, null. */
  serviceDate: Maybe<Scalars['Date']>;
  /** For ride legs, the service journey. For non-ride legs, null. */
  serviceJourney: Maybe<ServiceJourney>;
  /** For ride legs, all estimated calls for the service journey. For non-ride legs, empty list. */
  serviceJourneyEstimatedCalls: Array<EstimatedCall>;
  /** All relevant situations for this leg */
  situations: Array<PtSituationElement>;
  /** Do we continue from a specified via place */
  steps: Array<Maybe<PathGuidance>>;
  /** EstimatedCall for the quay where the leg ends. */
  toEstimatedCall: Maybe<EstimatedCall>;
  /** The Place where the leg ends. */
  toPlace: Place;
  /** The transport sub mode (e.g., localBus or expressBus) used when traversing this leg. Null if leg is not a ride */
  transportSubmode: Maybe<TransportSubmode>;
  /** Whether this leg is walking with a bike. */
  walkingBike: Maybe<Scalars['Boolean']>;
};


/** Part of a trip pattern. Either a ride on a public transport vehicle or access or path link to/from/between places */
export type LegNextLegsArgs = {
  filter?: InputMaybe<AlternativeLegsFilter>;
  next?: InputMaybe<Scalars['Int']>;
};


/** Part of a trip pattern. Either a ride on a public transport vehicle or access or path link to/from/between places */
export type LegPreviousLegsArgs = {
  filter?: InputMaybe<AlternativeLegsFilter>;
  previous?: InputMaybe<Scalars['Int']>;
};

/** A group of routes which is generally known to the public by a similar name or number */
export type Line = {
  __typename?: 'Line';
  authority: Maybe<Authority>;
  bikesAllowed: Maybe<BikesAllowed>;
  /**
   * Booking arrangements for flexible line.
   * @deprecated BookingArrangements are defined per stop, and can be found under `passingTimes` or `estimatedCalls`
   */
  bookingArrangements: Maybe<BookingArrangement>;
  branding: Maybe<Branding>;
  description: Maybe<Scalars['String']>;
  /** Type of flexible line, or null if line is not flexible. */
  flexibleLineType: Maybe<Scalars['String']>;
  /** Groups of lines that line is a part of. */
  groupOfLines: Array<Maybe<GroupOfLines>>;
  id: Scalars['ID'];
  journeyPatterns: Maybe<Array<Maybe<JourneyPattern>>>;
  name: Maybe<Scalars['String']>;
  notices: Array<Notice>;
  operator: Maybe<Operator>;
  presentation: Maybe<Presentation>;
  /** Publicly announced code for line, differentiating it from other lines for the same operator. */
  publicCode: Maybe<Scalars['String']>;
  quays: Array<Maybe<Quay>>;
  serviceJourneys: Array<Maybe<ServiceJourney>>;
  /** Get all situations active for the line. */
  situations: Array<PtSituationElement>;
  transportMode: Maybe<TransportMode>;
  transportSubmode: Maybe<TransportSubmode>;
  url: Maybe<Scalars['String']>;
};

export enum Locale {
  No = 'no',
  Us = 'us'
}

/** Input format for specifying a location through either a place reference (id), coordinates or both. If both place and coordinates are provided the place ref will be used if found, coordinates will only be used if place is not known. */
export type Location = {
  /** Coordinates for the location. This can be used alone or as fallback if the place id is not found. */
  coordinates?: InputMaybe<InputCoordinates>;
  /** The name of the location. This is pass-through informationand is not used in routing. */
  name?: InputMaybe<Scalars['String']>;
  /** The id of an element in the OTP model. Currently supports Quay, StopPlace, multimodal StopPlace, and GroupOfStopPlaces. */
  place?: InputMaybe<Scalars['String']>;
};

export enum Mode {
  Air = 'air',
  Bicycle = 'bicycle',
  Bus = 'bus',
  Cableway = 'cableway',
  Car = 'car',
  Coach = 'coach',
  Foot = 'foot',
  Funicular = 'funicular',
  Lift = 'lift',
  Metro = 'metro',
  Monorail = 'monorail',
  Rail = 'rail',
  Scooter = 'scooter',
  Tram = 'tram',
  Trolleybus = 'trolleybus',
  Water = 'water'
}

/** Input format for specifying which modes will be allowed for this search. If this element is not present, it will default to accessMode/egressMode/directMode of foot and all transport modes will be allowed. */
export type Modes = {
  /** The mode used to get from the origin to the access stops in the transit network the transit network (first-mile). If the element is not present or null,only transit that can be immediately boarded from the origin will be used. */
  accessMode?: InputMaybe<StreetMode>;
  /** The mode used to get from the origin to the destination directly, without using the transit network. If the element is not present or null,direct travel without using transit will be disallowed. */
  directMode?: InputMaybe<StreetMode>;
  /** The mode used to get from the egress stops in the transit network tothe destination (last-mile). If the element is not present or null,only transit that can immediately arrive at the origin will be used. */
  egressMode?: InputMaybe<StreetMode>;
  /** The allowed modes for the transit part of the trip. Use an empty list to disallow transit for this search. If the element is not present or null, it will default to all transport modes. */
  transportModes?: InputMaybe<Array<InputMaybe<TransportModes>>>;
};

export enum MultiModalMode {
  /** Both multiModal parents and their mono modal child stop places. */
  All = 'all',
  /** Only mono modal children stop places, not their multi modal parent stop */
  Child = 'child',
  /** Multi modal parent stop places without their mono modal children. */
  Parent = 'parent'
}

/** Text with language */
export type MultilingualString = {
  __typename?: 'MultilingualString';
  language: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

export type Notice = {
  __typename?: 'Notice';
  id: Scalars['ID'];
  publicCode: Maybe<Scalars['String']>;
  text: Maybe<Scalars['String']>;
};

export enum OccupancyStatus {
  /** The vehicle or carriage has a few seats available. */
  FewSeatsAvailable = 'fewSeatsAvailable',
  /** The vehicle or carriage is considered full by most measures, but may still be allowing passengers to board. */
  Full = 'full',
  /** The vehicle or carriage has a large number of seats available. */
  ManySeatsAvailable = 'manySeatsAvailable',
  /** The vehicle or carriage doesn't have any occupancy data available. */
  NoData = 'noData',
  /** The vehicle or carriage has no seats or standing room available. */
  NotAcceptingPassengers = 'notAcceptingPassengers',
  /** The vehicle or carriage only has standing room available. */
  StandingRoomOnly = 'standingRoomOnly'
}

/** Organisation providing public transport services. */
export type Operator = {
  __typename?: 'Operator';
  id: Scalars['ID'];
  lines: Array<Maybe<Line>>;
  name: Scalars['String'];
  phone: Maybe<Scalars['String']>;
  serviceJourney: Array<Maybe<ServiceJourney>>;
  url: Maybe<Scalars['String']>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor: Maybe<Scalars['String']>;
};

/** A series of turn by turn instructions used for walking, biking and driving. */
export type PathGuidance = {
  __typename?: 'PathGuidance';
  /** This step is on an open area, such as a plaza or train platform, and thus the directions should say something like "cross" */
  area: Maybe<Scalars['Boolean']>;
  /** The name of this street was generated by the system, so we should only display it once, and generally just display right/left directions */
  bogusName: Maybe<Scalars['Boolean']>;
  /** The distance in meters that this step takes. */
  distance: Maybe<Scalars['Float']>;
  /** When exiting a highway or traffic circle, the exit name/number. */
  exit: Maybe<Scalars['String']>;
  /** The absolute direction of this step. */
  heading: Maybe<AbsoluteDirection>;
  /** The latitude of the step. */
  latitude: Maybe<Scalars['Float']>;
  /** The longitude of the step. */
  longitude: Maybe<Scalars['Float']>;
  /** The relative direction of this step. */
  relativeDirection: Maybe<RelativeDirection>;
  /** Indicates whether or not a street changes direction at an intersection. */
  stayOn: Maybe<Scalars['Boolean']>;
  /** The name of the street. */
  streetName: Maybe<Scalars['String']>;
};

/** Common super class for all places (stop places, quays, car parks, bike parks and bike rental stations ) */
export type Place = {
  __typename?: 'Place';
  /** The bike rental station related to the place */
  bikeRentalStation: Maybe<BikeRentalStation>;
  /** The flexible area related to the place. */
  flexibleArea: Maybe<Scalars['Coordinates']>;
  /** The latitude of the place. */
  latitude: Scalars['Float'];
  /** The longitude of the place. */
  longitude: Scalars['Float'];
  /** For transit quays, the name of the quay. For points of interest, the name of the POI. */
  name: Maybe<Scalars['String']>;
  /** The quay related to the place. */
  quay: Maybe<Quay>;
  /** The rental vehicle related to the place */
  rentalVehicle: Maybe<RentalVehicle>;
  /** Type of vertex. (Normal, Bike sharing station, Bike P+R, Transit quay) Mostly used for better localization of bike sharing and P+R station names */
  vertexType: Maybe<VertexType>;
};

export type PlaceAtDistance = {
  __typename?: 'PlaceAtDistance';
  distance: Maybe<Scalars['Float']>;
  /** @deprecated Id is not referable or meaningful and will be removed */
  id: Scalars['ID'];
  place: Maybe<PlaceInterface>;
};

/** Interface for places, i.e. quays, stop places, parks */
export type PlaceInterface = {
  id: Scalars['ID'];
  latitude: Maybe<Scalars['Float']>;
  longitude: Maybe<Scalars['Float']>;
};

/** A list of coordinates encoded as a polyline string (see http://code.google.com/apis/maps/documentation/polylinealgorithm.html) */
export type PointsOnLink = {
  __typename?: 'PointsOnLink';
  /** The number of points in the string */
  length: Maybe<Scalars['Int']>;
  /** The encoded points of the polyline. Be aware that the string could contain escape characters that need to be accounted for. (https://www.freeformatter.com/javascript-escape.html) */
  points: Maybe<Scalars['String']>;
};

/** Types describing common presentation properties */
export type Presentation = {
  __typename?: 'Presentation';
  colour: Maybe<Scalars['String']>;
  textColour: Maybe<Scalars['String']>;
};

/** Simple public transport situation element */
export type PtSituationElement = {
  __typename?: 'PtSituationElement';
  /** Advice of situation in all different translations available */
  advice: Array<MultilingualString>;
  /** Get affected authority for this situation element */
  authority: Maybe<Authority>;
  /** Description of situation in all different translations available */
  description: Array<MultilingualString>;
  id: Scalars['ID'];
  /** Optional links to more information. */
  infoLinks: Maybe<Array<InfoLink>>;
  lines: Array<Maybe<Line>>;
  /** Priority of this situation  */
  priority: Maybe<Scalars['Int']>;
  quays: Array<Maybe<Quay>>;
  /**
   * Authority that reported this situation
   * @deprecated Not yet officially supported. May be removed or renamed.
   */
  reportAuthority: Maybe<Authority>;
  /** ReportType of this situation */
  reportType: Maybe<ReportType>;
  serviceJourneys: Array<Maybe<ServiceJourney>>;
  /** Severity of this situation  */
  severity: Maybe<Severity>;
  /** Operator's internal id for this situation */
  situationNumber: Maybe<Scalars['String']>;
  /** Summary of situation in all different translations available */
  summary: Array<MultilingualString>;
  /** Period this situation is in effect */
  validityPeriod: Maybe<ValidityPeriod>;
};

export enum PurchaseWhen {
  AdvanceAndDayOfTravel = 'advanceAndDayOfTravel',
  DayOfTravelOnly = 'dayOfTravelOnly',
  Other = 'other',
  TimeOfTravelOnly = 'timeOfTravelOnly',
  UntilPreviousDay = 'untilPreviousDay'
}

/** A place such as platform, stance, or quayside where passengers have access to PT vehicles. */
export type Quay = PlaceInterface & {
  __typename?: 'Quay';
  description: Maybe<Scalars['String']>;
  /** List of visits to this quay as part of vehicle journeys. */
  estimatedCalls: Array<EstimatedCall>;
  /** Geometry for flexible area. */
  flexibleArea: Maybe<Scalars['Coordinates']>;
  /** the Quays part of an flexible group. */
  flexibleGroup: Maybe<Array<Maybe<Quay>>>;
  id: Scalars['ID'];
  /** List of journey patterns servicing this quay */
  journeyPatterns: Array<Maybe<JourneyPattern>>;
  latitude: Maybe<Scalars['Float']>;
  /** List of lines servicing this quay */
  lines: Array<Line>;
  longitude: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  /** Public code used to identify this quay within the stop place. For instance a platform code. */
  publicCode: Maybe<Scalars['String']>;
  /** Get all situations active for the quay. */
  situations: Array<PtSituationElement>;
  /** The stop place to which this quay belongs to. */
  stopPlace: Maybe<StopPlace>;
  stopType: Maybe<Scalars['String']>;
  tariffZones: Array<Maybe<TariffZone>>;
  timeZone: Maybe<Scalars['String']>;
  /** Whether this quay is suitable for wheelchair boarding. */
  wheelchairAccessible: Maybe<WheelchairBoarding>;
};


/** A place such as platform, stance, or quayside where passengers have access to PT vehicles. */
export type QuayEstimatedCallsArgs = {
  arrivalDeparture?: InputMaybe<ArrivalDeparture>;
  includeCancelledTrips?: InputMaybe<Scalars['Boolean']>;
  numberOfDepartures?: InputMaybe<Scalars['Int']>;
  numberOfDeparturesPerLineAndDestinationDisplay?: InputMaybe<Scalars['Int']>;
  startTime?: InputMaybe<Scalars['DateTime']>;
  timeRange?: InputMaybe<Scalars['Int']>;
  whiteListed?: InputMaybe<InputWhiteListed>;
  whiteListedModes?: InputMaybe<Array<InputMaybe<TransportMode>>>;
};


/** A place such as platform, stance, or quayside where passengers have access to PT vehicles. */
export type QuayNameArgs = {
  lang?: InputMaybe<Scalars['String']>;
};

export type QuayAtDistance = {
  __typename?: 'QuayAtDistance';
  /** The distance in meters to the given quay. */
  distance: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  quay: Maybe<Quay>;
};

export type QueryType = {
  __typename?: 'QueryType';
  /** Get all authorities */
  authorities: Array<Maybe<Authority>>;
  /** Get an authority by ID */
  authority: Maybe<Authority>;
  /** Get a single bike park based on its id */
  bikePark: Maybe<BikePark>;
  /** Get all bike parks */
  bikeParks: Array<Maybe<BikePark>>;
  /** Get all bike rental stations */
  bikeRentalStation: Maybe<BikeRentalStation>;
  /** Get all bike rental stations */
  bikeRentalStations: Array<Maybe<BikeRentalStation>>;
  /** Get all bike rental stations within the specified bounding box. */
  bikeRentalStationsByBbox: Array<Maybe<BikeRentalStation>>;
  /** Get a single dated service journey based on its id */
  datedServiceJourney: Maybe<DatedServiceJourney>;
  /** Get all dated service journeys, matching the filters */
  datedServiceJourneys: Array<DatedServiceJourney>;
  /** Get a single group of lines based on its id */
  groupOfLines: Maybe<GroupOfLines>;
  /** Get all groups of lines */
  groupsOfLines: Array<GroupOfLines>;
  /** Refetch a single leg based on its id */
  leg: Maybe<Leg>;
  /** Get a single line based on its id */
  line: Maybe<Line>;
  /** Get all lines */
  lines: Array<Maybe<Line>>;
  /** Get all places (quays, stop places, car parks etc. with coordinates) within the specified radius from a location. The returned type has two fields place and distance. The search is done by walking so the distance is according to the network of walkables. */
  nearest: Maybe<PlaceAtDistanceConnection>;
  /** Get a operator by ID */
  operator: Maybe<Operator>;
  /** Get all operators */
  operators: Array<Maybe<Operator>>;
  /** Get a single quay based on its id) */
  quay: Maybe<Quay>;
  /** Get all quays */
  quays: Array<Maybe<Quay>>;
  /** Get all quays within the specified bounding box */
  quaysByBbox: Array<Maybe<Quay>>;
  /** Get all quays within the specified walking radius from a location. The returned type has two fields quay and distance */
  quaysByRadius: Maybe<QuayAtDistanceConnection>;
  /** Get default routing parameters. */
  routingParameters: Maybe<RoutingParameters>;
  /** Get OTP server information */
  serverInfo: ServerInfo;
  /** Get a single service journey based on its id */
  serviceJourney: Maybe<ServiceJourney>;
  /** Get all service journeys */
  serviceJourneys: Array<Maybe<ServiceJourney>>;
  /** Get a single situation based on its situationNumber */
  situation: Maybe<PtSituationElement>;
  /** Get all active situations. */
  situations: Array<PtSituationElement>;
  /** Get a single stopPlace based on its id) */
  stopPlace: Maybe<StopPlace>;
  /** Get all stopPlaces */
  stopPlaces: Array<Maybe<StopPlace>>;
  /** Get all stop places within the specified bounding box */
  stopPlacesByBbox: Array<Maybe<StopPlace>>;
  /** Input type for executing a travel search for a trip between two locations. Returns trip patterns describing suggested alternatives for the trip. */
  trip: Trip;
  /**
   * Input type for executing a travel search for a trip between three or more locations. Returns trip patterns describing suggested alternatives for the trip.
   * @deprecated This API is under development, expect the contract to change
   */
  viaTrip: ViaTrip;
};


export type QueryTypeAuthorityArgs = {
  id: Scalars['String'];
};


export type QueryTypeBikeParkArgs = {
  id: Scalars['String'];
};


export type QueryTypeBikeRentalStationArgs = {
  id: Scalars['String'];
};


export type QueryTypeBikeRentalStationsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryTypeBikeRentalStationsByBboxArgs = {
  maximumLatitude?: InputMaybe<Scalars['Float']>;
  maximumLongitude?: InputMaybe<Scalars['Float']>;
  minimumLatitude?: InputMaybe<Scalars['Float']>;
  minimumLongitude?: InputMaybe<Scalars['Float']>;
};


export type QueryTypeDatedServiceJourneyArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryTypeDatedServiceJourneysArgs = {
  alterations?: InputMaybe<Array<ServiceAlteration>>;
  authorities?: InputMaybe<Array<Scalars['String']>>;
  lines?: InputMaybe<Array<Scalars['String']>>;
  operatingDays: Array<Scalars['Date']>;
  privateCodes?: InputMaybe<Array<Scalars['String']>>;
  replacementFor?: InputMaybe<Array<Scalars['String']>>;
  serviceJourneys?: InputMaybe<Array<Scalars['String']>>;
};


export type QueryTypeGroupOfLinesArgs = {
  id: Scalars['String'];
};


export type QueryTypeLegArgs = {
  id: Scalars['ID'];
};


export type QueryTypeLineArgs = {
  id: Scalars['ID'];
};


export type QueryTypeLinesArgs = {
  authorities?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  flexibleOnly?: InputMaybe<Scalars['Boolean']>;
  ids?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  name?: InputMaybe<Scalars['String']>;
  publicCode?: InputMaybe<Scalars['String']>;
  publicCodes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  transportModes?: InputMaybe<Array<InputMaybe<TransportMode>>>;
};


export type QueryTypeNearestArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filterByIds?: InputMaybe<InputPlaceIds>;
  filterByInUse?: InputMaybe<Scalars['Boolean']>;
  filterByModes?: InputMaybe<Array<InputMaybe<TransportMode>>>;
  filterByPlaceTypes?: InputMaybe<Array<InputMaybe<FilterPlaceType>>>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  maximumDistance?: Scalars['Float'];
  maximumResults?: InputMaybe<Scalars['Int']>;
  multiModalMode?: InputMaybe<MultiModalMode>;
};


export type QueryTypeOperatorArgs = {
  id: Scalars['String'];
};


export type QueryTypeQuayArgs = {
  id: Scalars['String'];
};


export type QueryTypeQuaysArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  name?: InputMaybe<Scalars['String']>;
};


export type QueryTypeQuaysByBboxArgs = {
  authority?: InputMaybe<Scalars['String']>;
  filterByInUse?: InputMaybe<Scalars['Boolean']>;
  maximumLatitude: Scalars['Float'];
  maximumLongitude: Scalars['Float'];
  minimumLatitude: Scalars['Float'];
  minimumLongitude: Scalars['Float'];
};


export type QueryTypeQuaysByRadiusArgs = {
  after?: InputMaybe<Scalars['String']>;
  authority?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  radius: Scalars['Float'];
};


export type QueryTypeServiceJourneyArgs = {
  id: Scalars['String'];
};


export type QueryTypeServiceJourneysArgs = {
  activeDates?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>;
  authorities?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  lines?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  privateCodes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryTypeSituationArgs = {
  situationNumber: Scalars['String'];
};


export type QueryTypeSituationsArgs = {
  authorities?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  severities?: InputMaybe<Array<InputMaybe<Severity>>>;
};


export type QueryTypeStopPlaceArgs = {
  id: Scalars['String'];
};


export type QueryTypeStopPlacesArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryTypeStopPlacesByBboxArgs = {
  authority?: InputMaybe<Scalars['String']>;
  filterByInUse?: InputMaybe<Scalars['Boolean']>;
  maximumLatitude: Scalars['Float'];
  maximumLongitude: Scalars['Float'];
  minimumLatitude: Scalars['Float'];
  minimumLongitude: Scalars['Float'];
  multiModalMode?: InputMaybe<MultiModalMode>;
};


export type QueryTypeTripArgs = {
  alightSlackDefault?: InputMaybe<Scalars['Int']>;
  alightSlackList?: InputMaybe<Array<InputMaybe<TransportModeSlack>>>;
  arriveBy?: InputMaybe<Scalars['Boolean']>;
  banned?: InputMaybe<InputBanned>;
  bicycleOptimisationMethod?: InputMaybe<BicycleOptimisationMethod>;
  bikeSpeed?: InputMaybe<Scalars['Float']>;
  boardSlackDefault?: InputMaybe<Scalars['Int']>;
  boardSlackList?: InputMaybe<Array<InputMaybe<TransportModeSlack>>>;
  dateTime?: InputMaybe<Scalars['DateTime']>;
  debugItineraryFilter?: InputMaybe<Scalars['Boolean']>;
  extraSearchCoachReluctance?: InputMaybe<Scalars['Float']>;
  from: Location;
  ignoreRealtimeUpdates?: InputMaybe<Scalars['Boolean']>;
  includePlannedCancellations?: InputMaybe<Scalars['Boolean']>;
  itineraryFilters?: InputMaybe<ItineraryFilters>;
  locale?: InputMaybe<Locale>;
  maximumTransfers?: InputMaybe<Scalars['Int']>;
  modes?: InputMaybe<Modes>;
  numTripPatterns?: InputMaybe<Scalars['Int']>;
  pageCursor?: InputMaybe<Scalars['String']>;
  searchWindow?: InputMaybe<Scalars['Int']>;
  timetableView?: InputMaybe<Scalars['Boolean']>;
  to: Location;
  transferPenalty?: InputMaybe<Scalars['Int']>;
  transferSlack?: InputMaybe<Scalars['Int']>;
  triangleFactors?: InputMaybe<TriangleFactors>;
  useBikeRentalAvailabilityInformation?: InputMaybe<Scalars['Boolean']>;
  waitReluctance?: InputMaybe<Scalars['Float']>;
  walkReluctance?: InputMaybe<Scalars['Float']>;
  walkSpeed?: InputMaybe<Scalars['Float']>;
  wheelchairAccessible?: InputMaybe<Scalars['Boolean']>;
  whiteListed?: InputMaybe<InputWhiteListed>;
};


export type QueryTypeViaTripArgs = {
  dateTime?: InputMaybe<Scalars['DateTime']>;
  from: Location;
  locale?: InputMaybe<Locale>;
  numTripPatterns?: InputMaybe<Scalars['Int']>;
  pageCursor?: InputMaybe<Scalars['String']>;
  searchWindow: Scalars['Duration'];
  to: Location;
  viaLocations: Array<ViaLocation>;
  viaRequests?: InputMaybe<Array<ViaRequest>>;
  wheelchairAccessible?: InputMaybe<Scalars['Boolean']>;
};

export enum RealtimeState {
  /** The service journey has been added using a real-time update, i.e. the service journey was not present in the regular time table. */
  Added = 'Added',
  /** The service journey has been canceled by a real-time update. */
  Canceled = 'canceled',
  /** The service journey information has been updated and resulted in a different journey pattern compared to the journey pattern of the scheduled service journey. */
  Modified = 'modified',
  /** The service journey information comes from the regular time table, i.e. no real-time update has been applied. */
  Scheduled = 'scheduled',
  /** The service journey information has been updated, but the journey pattern stayed the same as the journey pattern of the scheduled service journey. */
  Updated = 'updated'
}

export enum RelativeDirection {
  CircleClockwise = 'circleClockwise',
  CircleCounterclockwise = 'circleCounterclockwise',
  Continue = 'continue',
  Depart = 'depart',
  Elevator = 'elevator',
  HardLeft = 'hardLeft',
  HardRight = 'hardRight',
  Left = 'left',
  Right = 'right',
  SlightlyLeft = 'slightlyLeft',
  SlightlyRight = 'slightlyRight',
  UturnLeft = 'uturnLeft',
  UturnRight = 'uturnRight'
}

export type RentalVehicle = PlaceInterface & {
  __typename?: 'RentalVehicle';
  currentRangeMeters: Maybe<Scalars['Float']>;
  id: Scalars['ID'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  network: Scalars['String'];
  vehicleType: RentalVehicleType;
};

export type RentalVehicleType = {
  __typename?: 'RentalVehicleType';
  formFactor: Scalars['String'];
  maxRangeMeters: Maybe<Scalars['Float']>;
  name: Maybe<Scalars['String']>;
  propulsionType: Scalars['String'];
  vehicleTypeId: Scalars['String'];
};

export enum ReportType {
  /** Indicates a general info-message that should not affect trip. */
  General = 'general',
  /** Indicates an incident that may affect trip. */
  Incident = 'incident'
}

/** Description of the reason, why the planner did not return any results */
export type RoutingError = {
  __typename?: 'RoutingError';
  /** An enum describing the reason */
  code: RoutingErrorCode;
  /** A textual description of why the search failed. The clients are expected to have their own translations based on the code, for user visible error messages. */
  description: Scalars['String'];
  /** An enum describing the field which should be changed, in order for the search to succeed */
  inputField: Maybe<InputField>;
};

export enum RoutingErrorCode {
  /** The specified location is not close to any streets or transit stops */
  LocationNotFound = 'locationNotFound',
  /** No stops are reachable from the location specified. You can try searching using a different access or egress mode */
  NoStopsInRange = 'noStopsInRange',
  /** No transit connection was found between the origin and destination withing the operating day or the next day */
  NoTransitConnection = 'noTransitConnection',
  /** Transit connection was found, but it was outside the search window, see metadata for the next search window */
  NoTransitConnectionInSearchWindow = 'noTransitConnectionInSearchWindow',
  /** The coordinates are outside the bounds of the data currently loaded into the system */
  OutsideBounds = 'outsideBounds',
  /** The date specified is outside the range of data currently loaded into the system */
  OutsideServicePeriod = 'outsideServicePeriod',
  /** An unknown error happened during the search. The details have been logged to the server logs */
  SystemError = 'systemError',
  /** The origin and destination are so close to each other, that walking is always better, but no direct mode was specified for the search */
  WalkingBetterThanTransit = 'walkingBetterThanTransit'
}

/** The default parameters used in travel searches. */
export type RoutingParameters = {
  __typename?: 'RoutingParameters';
  /** The alightSlack is the minimum extra time after exiting a public transport vehicle. This is the default value used, if not overridden by the 'alightSlackList'. */
  alightSlackDefault: Maybe<Scalars['Int']>;
  /** List of alightSlack for a given set of modes. */
  alightSlackList: Maybe<Array<Maybe<TransportModeSlackType>>>;
  /** @deprecated Rental is specified by modes */
  allowBikeRental: Maybe<Scalars['Boolean']>;
  /** Separate cost for boarding a vehicle with a bicycle, which is more difficult than on foot. */
  bikeBoardCost: Maybe<Scalars['Int']>;
  /** Cost to park a bike. */
  bikeParkCost: Maybe<Scalars['Int']>;
  /** Time to park a bike. */
  bikeParkTime: Maybe<Scalars['Int']>;
  /** Cost to drop-off a rented bike. */
  bikeRentalDropOffCost: Maybe<Scalars['Int']>;
  /** Time to drop-off a rented bike. */
  bikeRentalDropOffTime: Maybe<Scalars['Int']>;
  /** Cost to rent a bike. */
  bikeRentalPickupCost: Maybe<Scalars['Int']>;
  /** Time to rent a bike. */
  bikeRentalPickupTime: Maybe<Scalars['Int']>;
  /** Max bike speed along streets, in meters per second */
  bikeSpeed: Maybe<Scalars['Float']>;
  /** The boardSlack is the minimum extra time to board a public transport vehicle. This is the same as the 'minimumTransferTime', except that this also apply to to the first transit leg in the trip. This is the default value used, if not overridden by the 'boardSlackList'. */
  boardSlackDefault: Maybe<Scalars['Int']>;
  /** List of boardSlack for a given set of modes. */
  boardSlackList: Maybe<Array<Maybe<TransportModeSlackType>>>;
  /** The acceleration speed of an automobile, in meters per second per second. */
  carAccelerationSpeed: Maybe<Scalars['Float']>;
  /** The deceleration speed of an automobile, in meters per second per second. */
  carDecelerationSpeed: Maybe<Scalars['Float']>;
  /** Time to park a car in a park and ride, w/o taking into account driving and walking cost. */
  carDropOffTime: Maybe<Scalars['Int']>;
  /** Max car speed along streets, in meters per second */
  carSpeed: Maybe<Scalars['Float']>;
  /** @deprecated NOT IN USE IN OTP2. */
  compactLegsByReversedSearch: Maybe<Scalars['Boolean']>;
  debugItineraryFilter: Maybe<Scalars['Boolean']>;
  /**
   * Option to disable the default filtering of GTFS-RT alerts by time.
   * @deprecated This is not supported!
   */
  disableAlertFiltering: Maybe<Scalars['Boolean']>;
  /** If true, the remaining weight heuristic is disabled. */
  disableRemainingWeightHeuristic: Maybe<Scalars['Boolean']>;
  /** What is the cost of boarding a elevator? */
  elevatorBoardCost: Maybe<Scalars['Int']>;
  /** How long does it take to get on an elevator, on average. */
  elevatorBoardTime: Maybe<Scalars['Int']>;
  /** What is the cost of travelling one floor on an elevator? */
  elevatorHopCost: Maybe<Scalars['Int']>;
  /** How long does it take to advance one floor on an elevator? */
  elevatorHopTime: Maybe<Scalars['Int']>;
  /** Whether to apply the ellipsoid->geoid offset to all elevations in the response. */
  geoIdElevation: Maybe<Scalars['Boolean']>;
  /** When true, realtime updates are ignored during this search. */
  ignoreRealTimeUpdates: Maybe<Scalars['Boolean']>;
  /** When true, service journeys cancelled in scheduled route data will be included during this search. */
  includedPlannedCancellations: Maybe<Scalars['Boolean']>;
  /** @deprecated Parking is specified by modes */
  kissAndRide: Maybe<Scalars['Boolean']>;
  /** This is the maximum duration in seconds for a direct street search. This is a performance limit and should therefore be set high. Use filters to limit what is presented to the client. */
  maxDirectStreetDuration: Maybe<Scalars['Int']>;
  /** The maximum slope of streets for wheelchair trips. */
  maxSlope: Maybe<Scalars['Float']>;
  /** Maximum number of transfers returned in a trip plan. */
  maxTransfers: Maybe<Scalars['Int']>;
  /** The maximum number of itineraries to return. */
  numItineraries: Maybe<Scalars['Int']>;
  /**
   * Accept only paths that use transit (no street-only paths).
   * @deprecated This is replaced by modes input object
   */
  onlyTransitTrips: Maybe<Scalars['Boolean']>;
  /** Penalty added for using every route that is not preferred if user set any route as preferred. We return number of seconds that we are willing to wait for preferred route. */
  otherThanPreferredRoutesPenalty: Maybe<Scalars['Int']>;
  /** @deprecated Parking is specified by modes */
  parkAndRide: Maybe<Scalars['Boolean']>;
  /** @deprecated NOT IN USE IN OTP2. */
  reverseOptimizeOnTheFly: Maybe<Scalars['Boolean']>;
  /**
   * Whether the planner should return intermediate stops lists for transit legs.
   * @deprecated This parameter is always enabled
   */
  showIntermediateStops: Maybe<Scalars['Boolean']>;
  /** Used instead of walkReluctance for stairs. */
  stairsReluctance: Maybe<Scalars['Float']>;
  /** An extra penalty added on transfers (i.e. all boardings except the first one). */
  transferPenalty: Maybe<Scalars['Int']>;
  /** A global minimum transfer time (in seconds) that specifies the minimum amount of time that must pass between exiting one transit vehicle and boarding another. */
  transferSlack: Maybe<Scalars['Int']>;
  /** Multiplicative factor on expected turning time. */
  turnReluctance: Maybe<Scalars['Float']>;
  /** How much worse is waiting for a transit vehicle than being on a transit vehicle, as a multiplier. */
  waitReluctance: Maybe<Scalars['Float']>;
  /** This prevents unnecessary transfers by adding a cost for boarding a vehicle. */
  walkBoardCost: Maybe<Scalars['Int']>;
  /** A multiplier for how bad walking is, compared to being in transit for equal lengths of time. */
  walkReluctance: Maybe<Scalars['Float']>;
  /** Max walk speed along streets, in meters per second */
  walkSpeed: Maybe<Scalars['Float']>;
  /** Whether the trip must be wheelchair accessible. */
  wheelChairAccessible: Maybe<Scalars['Boolean']>;
};

export type ServerInfo = {
  __typename?: 'ServerInfo';
  /** The 'configVersion' of the build-config.json file. */
  buildConfigVersion: Maybe<Scalars['String']>;
  /** OTP Build timestamp */
  buildTime: Maybe<Scalars['String']>;
  gitBranch: Maybe<Scalars['String']>;
  gitCommit: Maybe<Scalars['String']>;
  gitCommitTime: Maybe<Scalars['String']>;
  /** The 'configVersion' of the otp-config.json file. */
  otpConfigVersion: Maybe<Scalars['String']>;
  /** The otp-serialization-version-id used to check graphs for compatibility with current version of OTP. */
  otpSerializationVersionId: Maybe<Scalars['String']>;
  /** The 'configVersion' of the router-config.json file. */
  routerConfigVersion: Maybe<Scalars['String']>;
  /** Maven version */
  version: Maybe<Scalars['String']>;
};

export enum ServiceAlteration {
  Cancellation = 'cancellation',
  ExtraJourney = 'extraJourney',
  Planned = 'planned',
  Replaced = 'replaced'
}

/** A planned vehicle journey with passengers. */
export type ServiceJourney = {
  __typename?: 'ServiceJourney';
  activeDates: Array<Maybe<Scalars['Date']>>;
  /** Whether bikes are allowed on service journey. */
  bikesAllowed: Maybe<BikesAllowed>;
  /**
   * Booking arrangements for flexible services.
   * @deprecated BookingArrangements are defined per stop, and can be found under `passingTimes` or `estimatedCalls`
   */
  bookingArrangements: Maybe<BookingArrangement>;
  directionType: Maybe<DirectionType>;
  /** Returns scheduled passingTimes for this ServiceJourney for a given date, updated with realtime-updates (if available). NB! This takes a date as argument (default=today) and returns estimatedCalls for that date and should only be used if the date is known when creating the request. For fetching estimatedCalls for a given trip.leg, use leg.serviceJourneyEstimatedCalls instead. */
  estimatedCalls: Maybe<Array<Maybe<EstimatedCall>>>;
  id: Scalars['ID'];
  /** JourneyPattern for the service journey, according to scheduled data. If the ServiceJourney is not included in the scheduled data, null is returned. */
  journeyPattern: Maybe<JourneyPattern>;
  line: Line;
  notices: Array<Notice>;
  operator: Maybe<Operator>;
  /** Returns scheduled passing times only - without realtime-updates, for realtime-data use 'estimatedCalls' */
  passingTimes: Array<Maybe<TimetabledPassingTime>>;
  /** Detailed path travelled by service journey. Not available for flexible trips. */
  pointsOnLink: Maybe<PointsOnLink>;
  /** For internal use by operators. */
  privateCode: Maybe<Scalars['String']>;
  /** Publicly announced code for service journey, differentiating it from other service journeys for the same line. */
  publicCode: Maybe<Scalars['String']>;
  /** Quays visited by service journey, according to scheduled data. If the ServiceJourney is not included in the scheduled data, an empty list is returned. */
  quays: Array<Quay>;
  /** @deprecated The service journey alteration will be moved out of SJ and grouped together with the SJ and date. In Netex this new type is called DatedServiceJourney. We will create artificial DSJs for the old SJs. */
  serviceAlteration: Maybe<ServiceAlteration>;
  /** Get all situations active for the service journey. */
  situations: Array<PtSituationElement>;
  transportMode: Maybe<TransportMode>;
  transportSubmode: Maybe<TransportSubmode>;
  /** Whether service journey is accessible with wheelchair. */
  wheelchairAccessible: Maybe<WheelchairBoarding>;
};


/** A planned vehicle journey with passengers. */
export type ServiceJourneyEstimatedCallsArgs = {
  date?: InputMaybe<Scalars['Date']>;
};


/** A planned vehicle journey with passengers. */
export type ServiceJourneyQuaysArgs = {
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export enum Severity {
  /** Situation has no impact on trips. */
  NoImpact = 'noImpact',
  /** Situation has an impact on trips (default). */
  Normal = 'normal',
  /** Situation has a severe impact on trips. */
  Severe = 'severe',
  /** Situation has a slight impact on trips. */
  Slight = 'slight',
  /** Severity is undefined. */
  Undefined = 'undefined',
  /** Situation has unknown impact on trips. */
  Unknown = 'unknown',
  /** Situation has a very severe impact on trips. */
  VerySevere = 'verySevere',
  /** Situation has a very slight impact on trips. */
  VerySlight = 'verySlight'
}

/** Named place where public transport may be accessed. May be a building complex (e.g. a station) or an on-street location. */
export type StopPlace = PlaceInterface & {
  __typename?: 'StopPlace';
  description: Maybe<Scalars['String']>;
  /** List of visits to this stop place as part of vehicle journeys. */
  estimatedCalls: Array<EstimatedCall>;
  id: Scalars['ID'];
  latitude: Maybe<Scalars['Float']>;
  longitude: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  /** Returns parent stop for this stop */
  parent: Maybe<StopPlace>;
  /** Returns all quays that are children of this stop place */
  quays: Maybe<Array<Maybe<Quay>>>;
  tariffZones: Array<Maybe<TariffZone>>;
  timeZone: Maybe<Scalars['String']>;
  /** The transport modes of quays under this stop place. */
  transportMode: Maybe<Array<Maybe<TransportMode>>>;
  /** The transport submode serviced by this stop place. */
  transportSubmode: Maybe<Array<Maybe<TransportSubmode>>>;
  /** Relative weighting of this stop with regards to interchanges. NOT IMPLEMENTED */
  weighting: Maybe<InterchangeWeighting>;
};


/** Named place where public transport may be accessed. May be a building complex (e.g. a station) or an on-street location. */
export type StopPlaceEstimatedCallsArgs = {
  arrivalDeparture?: InputMaybe<ArrivalDeparture>;
  includeCancelledTrips?: InputMaybe<Scalars['Boolean']>;
  numberOfDepartures?: InputMaybe<Scalars['Int']>;
  numberOfDeparturesPerLineAndDestinationDisplay?: InputMaybe<Scalars['Int']>;
  startTime?: InputMaybe<Scalars['DateTime']>;
  timeRange?: InputMaybe<Scalars['Int']>;
  whiteListed?: InputMaybe<InputWhiteListed>;
  whiteListedModes?: InputMaybe<Array<InputMaybe<TransportMode>>>;
};


/** Named place where public transport may be accessed. May be a building complex (e.g. a station) or an on-street location. */
export type StopPlaceNameArgs = {
  lang?: InputMaybe<Scalars['String']>;
};


/** Named place where public transport may be accessed. May be a building complex (e.g. a station) or an on-street location. */
export type StopPlaceQuaysArgs = {
  filterByInUse?: InputMaybe<Scalars['Boolean']>;
};

/** List of coordinates between two stops as a polyline */
export type StopToStopGeometry = {
  __typename?: 'StopToStopGeometry';
  /** Origin Quay */
  fromQuay: Maybe<Quay>;
  /** A list of coordinates encoded as a polyline string between two stops (see http://code.google.com/apis/maps/documentation/polylinealgorithm.html) */
  pointsOnLink: Maybe<PointsOnLink>;
  /** Destination Quay */
  toQuay: Maybe<Quay>;
};

export enum StreetMode {
  /** Bike only. This can be used as access/egress, but transfers will still be walk only. */
  Bicycle = 'bicycle',
  /** Bike to a bike parking area, then walk the rest of the way. Direct mode and access mode only. */
  BikePark = 'bike_park',
  /** Walk to a bike rental point, bike to a bike rental drop-off point, and walk the rest of the way. This can include bike rental at fixed locations or free-floating services. */
  BikeRental = 'bike_rental',
  /** Car only. Direct mode only. */
  Car = 'car',
  /** Start in the car, drive to a parking area, and walk the rest of the way. Direct mode and access mode only. */
  CarPark = 'car_park',
  /** Walk to a pickup point along the road, drive to a drop-off point along the road, and walk the rest of the way. This can include various taxi-services or kiss & ride. */
  CarPickup = 'car_pickup',
  /** Walk to an eligible pickup area for flexible transportation, ride to an eligible drop-off area and then walk the rest of the way. */
  Flexible = 'flexible',
  /** Walk only */
  Foot = 'foot',
  /** Walk to a scooter rental point, ride a scooter to a scooter rental drop-off point, and walk the rest of the way. This can include scooter rental at fixed locations or free-floating services. */
  ScooterRental = 'scooter_rental'
}

/** A system notice is used to tag elements with system information for debugging or other system related purpose. One use-case is to run a routing search with 'itineraryFilters.debug: true'. This will then tag itineraries instead of removing them from the result. This make it possible to inspect the itinerary-filter-chain. A SystemNotice only have english text, because the primary user are technical staff, like testers and developers. */
export type SystemNotice = {
  __typename?: 'SystemNotice';
  tag: Maybe<Scalars['String']>;
  text: Maybe<Scalars['String']>;
};

export type TariffZone = {
  __typename?: 'TariffZone';
  id: Scalars['ID'];
  name: Maybe<Scalars['String']>;
};

export type TimeAndDayOffset = {
  __typename?: 'TimeAndDayOffset';
  /** Number of days offset from base line time */
  dayOffset: Maybe<Scalars['Int']>;
  /** Local time */
  time: Maybe<Scalars['Time']>;
};

/** Scheduled passing times. These are not affected by real time updates. */
export type TimetabledPassingTime = {
  __typename?: 'TimetabledPassingTime';
  /** Scheduled time of arrival at quay */
  arrival: Maybe<TimeAndDayOffset>;
  /** Booking arrangements for this passing time. */
  bookingArrangements: Maybe<BookingArrangement>;
  /** Scheduled time of departure from quay */
  departure: Maybe<TimeAndDayOffset>;
  destinationDisplay: Maybe<DestinationDisplay>;
  /** Whether vehicle may be alighted at quay. */
  forAlighting: Maybe<Scalars['Boolean']>;
  /** Whether vehicle may be boarded at quay. */
  forBoarding: Maybe<Scalars['Boolean']>;
  notices: Array<Notice>;
  quay: Maybe<Quay>;
  /** Whether vehicle will only stop on request. */
  requestStop: Maybe<Scalars['Boolean']>;
  serviceJourney: Maybe<ServiceJourney>;
  /** Whether this is a timing point or not. Boarding and alighting is not allowed at timing points. */
  timingPoint: Maybe<Scalars['Boolean']>;
};

export type TransitGeneralizedCostFilterParams = {
  costLimitFunction: Scalars['DoubleFunction'];
  intervalRelaxFactor: Scalars['Float'];
};

export enum TransportMode {
  Air = 'air',
  Bus = 'bus',
  Cableway = 'cableway',
  Coach = 'coach',
  Funicular = 'funicular',
  Lift = 'lift',
  Metro = 'metro',
  Monorail = 'monorail',
  Rail = 'rail',
  Tram = 'tram',
  Trolleybus = 'trolleybus',
  Unknown = 'unknown',
  Water = 'water'
}

/** Used to specify board and alight slack for a given modes. */
export type TransportModeSlack = {
  /** List of modes for which the given slack apply. */
  modes: Array<TransportMode>;
  /** The slack used for all given modes. */
  slack: Scalars['Int'];
};

/** Used to specify board and alight slack for a given modes. */
export type TransportModeSlackType = {
  __typename?: 'TransportModeSlackType';
  modes: Array<TransportMode>;
  slack: Scalars['Int'];
};

export type TransportModes = {
  /** A transportMode that should be allowed for this search. You can furthernarrow it down by specifying a list of transportSubModes */
  transportMode?: InputMaybe<TransportMode>;
  /** The allowed transportSubModes for this search. If this element is notpresent or null, it will default to all transportSubModes for the specifiedTransportMode. Be aware that all transportSubModes have an associated TransportMode, which must match what is specified in the transportMode field. */
  transportSubModes?: InputMaybe<Array<InputMaybe<TransportSubmode>>>;
};

export enum TransportSubmode {
  SchengenAreaFlight = 'SchengenAreaFlight',
  AirportBoatLink = 'airportBoatLink',
  AirportLinkBus = 'airportLinkBus',
  AirportLinkRail = 'airportLinkRail',
  AirshipService = 'airshipService',
  AllFunicularServices = 'allFunicularServices',
  AllHireVehicles = 'allHireVehicles',
  AllTaxiServices = 'allTaxiServices',
  BikeTaxi = 'bikeTaxi',
  BlackCab = 'blackCab',
  CableCar = 'cableCar',
  CableFerry = 'cableFerry',
  CanalBarge = 'canalBarge',
  CarTransportRailService = 'carTransportRailService',
  ChairLift = 'chairLift',
  CharterTaxi = 'charterTaxi',
  CityTram = 'cityTram',
  CommunalTaxi = 'communalTaxi',
  CommuterCoach = 'commuterCoach',
  CrossCountryRail = 'crossCountryRail',
  DedicatedLaneBus = 'dedicatedLaneBus',
  DemandAndResponseBus = 'demandAndResponseBus',
  DomesticCharterFlight = 'domesticCharterFlight',
  DomesticFlight = 'domesticFlight',
  DomesticScheduledFlight = 'domesticScheduledFlight',
  DragLift = 'dragLift',
  ExpressBus = 'expressBus',
  Funicular = 'funicular',
  HelicopterService = 'helicopterService',
  HighFrequencyBus = 'highFrequencyBus',
  HighSpeedPassengerService = 'highSpeedPassengerService',
  HighSpeedRail = 'highSpeedRail',
  HighSpeedVehicleService = 'highSpeedVehicleService',
  HireCar = 'hireCar',
  HireCycle = 'hireCycle',
  HireMotorbike = 'hireMotorbike',
  HireVan = 'hireVan',
  IntercontinentalCharterFlight = 'intercontinentalCharterFlight',
  IntercontinentalFlight = 'intercontinentalFlight',
  International = 'international',
  InternationalCarFerry = 'internationalCarFerry',
  InternationalCharterFlight = 'internationalCharterFlight',
  InternationalCoach = 'internationalCoach',
  InternationalFlight = 'internationalFlight',
  InternationalPassengerFerry = 'internationalPassengerFerry',
  InterregionalRail = 'interregionalRail',
  Lift = 'lift',
  Local = 'local',
  LocalBus = 'localBus',
  LocalCarFerry = 'localCarFerry',
  LocalPassengerFerry = 'localPassengerFerry',
  LocalTram = 'localTram',
  LongDistance = 'longDistance',
  Metro = 'metro',
  MiniCab = 'miniCab',
  MobilityBus = 'mobilityBus',
  MobilityBusForRegisteredDisabled = 'mobilityBusForRegisteredDisabled',
  NationalCarFerry = 'nationalCarFerry',
  NationalCoach = 'nationalCoach',
  NationalPassengerFerry = 'nationalPassengerFerry',
  NightBus = 'nightBus',
  NightRail = 'nightRail',
  PostBoat = 'postBoat',
  PostBus = 'postBus',
  RackAndPinionRailway = 'rackAndPinionRailway',
  RailReplacementBus = 'railReplacementBus',
  RailShuttle = 'railShuttle',
  RailTaxi = 'railTaxi',
  RegionalBus = 'regionalBus',
  RegionalCarFerry = 'regionalCarFerry',
  RegionalCoach = 'regionalCoach',
  RegionalPassengerFerry = 'regionalPassengerFerry',
  RegionalRail = 'regionalRail',
  RegionalTram = 'regionalTram',
  ReplacementRailService = 'replacementRailService',
  RiverBus = 'riverBus',
  RoadFerryLink = 'roadFerryLink',
  RoundTripCharterFlight = 'roundTripCharterFlight',
  ScheduledFerry = 'scheduledFerry',
  SchoolAndPublicServiceBus = 'schoolAndPublicServiceBus',
  SchoolBoat = 'schoolBoat',
  SchoolBus = 'schoolBus',
  SchoolCoach = 'schoolCoach',
  ShortHaulInternationalFlight = 'shortHaulInternationalFlight',
  ShuttleBus = 'shuttleBus',
  ShuttleCoach = 'shuttleCoach',
  ShuttleFerryService = 'shuttleFerryService',
  ShuttleFlight = 'shuttleFlight',
  ShuttleTram = 'shuttleTram',
  SightseeingBus = 'sightseeingBus',
  SightseeingCoach = 'sightseeingCoach',
  SightseeingFlight = 'sightseeingFlight',
  SightseeingService = 'sightseeingService',
  SightseeingTram = 'sightseeingTram',
  SleeperRailService = 'sleeperRailService',
  SpecialCoach = 'specialCoach',
  SpecialNeedsBus = 'specialNeedsBus',
  SpecialTrain = 'specialTrain',
  StreetCableCar = 'streetCableCar',
  SuburbanRailway = 'suburbanRailway',
  Telecabin = 'telecabin',
  TelecabinLink = 'telecabinLink',
  TouristCoach = 'touristCoach',
  TouristRailway = 'touristRailway',
  TrainFerry = 'trainFerry',
  TrainTram = 'trainTram',
  Tube = 'tube',
  Undefined = 'undefined',
  UndefinedFunicular = 'undefinedFunicular',
  Unknown = 'unknown',
  UrbanRailway = 'urbanRailway',
  WaterTaxi = 'waterTaxi'
}

/** How much the factors safety, slope and distance are weighted relative to each other when routing bicycle legs. In total all three values need to add up to 1. */
export type TriangleFactors = {
  /** How important is bicycle safety expressed as a fraction of 1. */
  safety: Scalars['Float'];
  /** How important is slope/elevation expressed as a fraction of 1. */
  slope: Scalars['Float'];
  /** How important is time expressed as a fraction of 1. Note that what this really optimises for is distance (even if that means going over terrible surfaces, so I might be slower than the safe route). */
  time: Scalars['Float'];
};

/** Description of a travel between two places. */
export type Trip = {
  __typename?: 'Trip';
  /** The time and date of travel */
  dateTime: Maybe<Scalars['DateTime']>;
  /** Information about the timings for the trip generation */
  debugOutput: DebugOutput;
  /** The origin */
  fromPlace: Place;
  /**
   * A list of possible error messages as enum
   * @deprecated Use routingErrors instead
   */
  messageEnums: Array<Maybe<Scalars['String']>>;
  /**
   * A list of possible error messages in cleartext
   * @deprecated Use routingErrors instead
   */
  messageStrings: Array<Maybe<Scalars['String']>>;
  /** The trip request metadata. */
  metadata: Maybe<TripSearchData>;
  /**
   * Use the cursor to get the next page of results. Use this cursor for the pageCursor parameter in the trip query in order to get the next page.
   * The next page is a set of itineraries departing AFTER the last itinerary in this result.
   */
  nextPageCursor: Maybe<Scalars['String']>;
  /**
   * Use the cursor to get the previous page of results. Use this cursor for the pageCursor parameter in the trip query in order to get the previous page.
   * The previous page is a set of itineraries departing BEFORE the first itinerary in this result.
   */
  previousPageCursor: Maybe<Scalars['String']>;
  /** A list of routing errors, and fields which caused them */
  routingErrors: Array<RoutingError>;
  /** The destination */
  toPlace: Place;
  /** A list of possible trip patterns */
  tripPatterns: Array<TripPattern>;
};


/** Description of a travel between two places. */
export type TripMessageStringsArgs = {
  language?: InputMaybe<Scalars['String']>;
};

/** List of legs constituting a suggested sequence of rides and links for a specific trip. */
export type TripPattern = {
  __typename?: 'TripPattern';
  /** The aimed date and time the trip ends. */
  aimedEndTime: Scalars['DateTime'];
  /** The aimed date and time the trip starts. */
  aimedStartTime: Scalars['DateTime'];
  /** NOT IMPLEMENTED. */
  directDuration: Maybe<Scalars['Long']>;
  /** Total distance for the trip, in meters. NOT IMPLEMENTED */
  distance: Maybe<Scalars['Float']>;
  /** Duration of the trip, in seconds. */
  duration: Maybe<Scalars['Long']>;
  /**
   * Time that the trip arrives.
   * @deprecated Replaced with expectedEndTime
   */
  endTime: Maybe<Scalars['DateTime']>;
  /** The expected, realtime adjusted date and time the trip ends. */
  expectedEndTime: Scalars['DateTime'];
  /** The expected, realtime adjusted date and time the trip starts. */
  expectedStartTime: Scalars['DateTime'];
  /** Generalized cost or weight of the itinerary. Used for debugging. */
  generalizedCost: Maybe<Scalars['Int']>;
  /** A list of legs. Each leg is either a walking (cycling, car) portion of the trip, or a ride leg on a particular vehicle. So a trip where the use walks to the Q train, transfers to the 6, then walks to their destination, has four legs. */
  legs: Array<Leg>;
  /**
   * Time that the trip departs.
   * @deprecated Replaced with expectedStartTime
   */
  startTime: Maybe<Scalars['DateTime']>;
  /** Get all system notices. */
  systemNotices: Array<SystemNotice>;
  /** A cost calculated to favor transfer with higher priority. This field is meant for debugging only. */
  transferPriorityCost: Maybe<Scalars['Int']>;
  /** A cost calculated to distribute wait-time and avoid very short transfers. This field is meant for debugging only. */
  waitTimeOptimizedCost: Maybe<Scalars['Int']>;
  /** How much time is spent waiting for transit to arrive, in seconds. */
  waitingTime: Maybe<Scalars['Long']>;
  /** How far the user has to walk, in meters. */
  walkDistance: Maybe<Scalars['Float']>;
  /** How much time is spent walking, in seconds. */
  walkTime: Maybe<Scalars['Long']>;
};

/** Trips search metadata. */
export type TripSearchData = {
  __typename?: 'TripSearchData';
  /**
   * This is the suggested search time for the "next page" or time window. Insert it together with the 'searchWindowUsed' in the request to get a new set of trips following in the time-window AFTER the current search.
   * @deprecated Use pageCursor instead
   */
  nextDateTime: Maybe<Scalars['DateTime']>;
  /**
   * This is the suggested search time for the "previous page" or time-window. Insert it together with the 'searchWindowUsed' in the request to get a new set of trips preceding in the time-window BEFORE the current search.
   * @deprecated Use pageCursor instead
   */
  prevDateTime: Maybe<Scalars['DateTime']>;
  /** This is the time window used by the raptor search. The input searchWindow is an optional parameter and is dynamically assigned if not set. OTP might override the value if it is too small or too large. When paging OTP adjusts it to the appropriate size, depending on the number of itineraries found in the current search window. The scaling of the search window ensures faster paging and limits resource usage. The unit is seconds. */
  searchWindowUsed: Scalars['Int'];
};

export type ValidityPeriod = {
  __typename?: 'ValidityPeriod';
  /** End of validity period. Will return 'null' if validity is open-ended. */
  endTime: Maybe<Scalars['DateTime']>;
  /** Start of validity period */
  startTime: Maybe<Scalars['DateTime']>;
};

export enum VertexType {
  BikePark = 'bikePark',
  BikeShare = 'bikeShare',
  Normal = 'normal',
  Transit = 'transit'
}

/** Input format for specifying a location through either a place reference (id), coordinates or both. If both place and coordinates are provided the place ref will be used if found, coordinates will only be used if place is not known. */
export type ViaLocation = {
  /** Coordinates for the location. This can be used alone or as fallback if the place id is not found. */
  coordinates?: InputMaybe<InputCoordinates>;
  /** The maximum time the user wants to stay in the via location before continuing his journey */
  maxSlack?: InputMaybe<Scalars['Duration']>;
  /** The minimum time the user wants to stay in the via location before continuing his journey */
  minSlack?: InputMaybe<Scalars['Duration']>;
  /** The name of the location. This is pass-through informationand is not used in routing. */
  name?: InputMaybe<Scalars['String']>;
  /** The id of an element in the OTP model. Currently supports Quay, StopPlace, multimodal StopPlace, and GroupOfStopPlaces. */
  place?: InputMaybe<Scalars['String']>;
};

export type ViaRequest = {
  /** The set of access/egress/direct/transit modes to be used for this search. Note that this only works at the Line level. If individual ServiceJourneys have modes that differ from the Line mode, this will NOT be accounted for. */
  modes?: InputMaybe<Modes>;
};

/** Description of a travel between three or more places. */
export type ViaTrip = {
  __typename?: 'ViaTrip';
  /** A list of routing errors, and fields which caused them */
  routingErrors: Array<RoutingError>;
  /** A list of lists of which indices of the next segment the trip pattern can be combined with */
  tripPatternCombinations: Array<Array<Array<Scalars['Int']>>>;
  /** A list of lists of the trip patterns for each segment of the journey */
  tripPatterns: Array<Array<TripPattern>>;
};

export enum WheelchairBoarding {
  /** There is no accessibility information for the stopPlace/quay. */
  NoInformation = 'noInformation',
  /** Wheelchair boarding/alighting is not possible at this stop. */
  NotPossible = 'notPossible',
  /** Boarding wheelchair-accessible serviceJourneys is possible at this stopPlace/quay. */
  Possible = 'possible'
}

export type DebugOutput = {
  __typename?: 'debugOutput';
  totalTime: Maybe<Scalars['Long']>;
};

export type InfoLink = {
  __typename?: 'infoLink';
  /** Label */
  label: Maybe<Scalars['String']>;
  /** URI */
  uri: Scalars['String'];
};

/** A connection to a list of items. */
export type PlaceAtDistanceConnection = {
  __typename?: 'placeAtDistanceConnection';
  /** a list of edges */
  edges: Maybe<Array<Maybe<PlaceAtDistanceEdge>>>;
  /** details about this specific page */
  pageInfo: PageInfo;
};

/** An edge in a connection */
export type PlaceAtDistanceEdge = {
  __typename?: 'placeAtDistanceEdge';
  /** cursor marks a unique position or index into the connection */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: Maybe<PlaceAtDistance>;
};

/** A connection to a list of items. */
export type QuayAtDistanceConnection = {
  __typename?: 'quayAtDistanceConnection';
  /** a list of edges */
  edges: Maybe<Array<Maybe<QuayAtDistanceEdge>>>;
  /** details about this specific page */
  pageInfo: PageInfo;
};

/** An edge in a connection */
export type QuayAtDistanceEdge = {
  __typename?: 'quayAtDistanceEdge';
  /** cursor marks a unique position or index into the connection */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node: Maybe<QuayAtDistance>;
};

export type BusTileQueryVariables = Exact<{
  ids: Array<Scalars['String']> | Scalars['String'];
}>;


export type BusTileQuery = { __typename?: 'QueryType', stopPlaces: Array<{ __typename?: 'StopPlace', id: string, name: string, description: string | null, latitude: number | null, longitude: number | null, transportMode: Array<TransportMode | null> | null, transportSubmode: Array<TransportSubmode | null> | null, estimatedCalls: Array<{ __typename?: 'EstimatedCall', aimedDepartureTime: DateTime, cancellation: boolean, date: Date | null, expectedDepartureTime: DateTime, destinationDisplay: { __typename?: 'DestinationDisplay', frontText: string | null } | null, quay: { __typename?: 'Quay', id: string, name: string, publicCode: string | null } | null, serviceJourney: { __typename?: 'ServiceJourney', id: string, transportSubmode: TransportSubmode | null, journeyPattern: { __typename?: 'JourneyPattern', line: { __typename?: 'Line', publicCode: string | null, transportMode: TransportMode | null } } | null } | null, situations: Array<{ __typename?: 'PtSituationElement', summary: Array<{ __typename?: 'MultilingualString', value: string }> }> }> } | null> };

export type StopPlaceIdsQueryVariables = Exact<{
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  maximumDistance: Scalars['Float'];
  filterByPlaceTypes?: InputMaybe<Array<InputMaybe<FilterPlaceType>> | InputMaybe<FilterPlaceType>>;
  multiModalMode?: InputMaybe<MultiModalMode>;
}>;


export type StopPlaceIdsQuery = { __typename?: 'QueryType', nearest: { __typename?: 'placeAtDistanceConnection', edges: Array<{ __typename?: 'placeAtDistanceEdge', node: { __typename?: 'PlaceAtDistance', place: { __typename?: 'BikePark', id: string } | { __typename?: 'BikeRentalStation', id: string } | { __typename?: 'Quay', id: string } | { __typename?: 'RentalVehicle', id: string } | { __typename?: 'StopPlace', id: string } | null } | null } | null> | null } | null };

export type StopPlaceWithEstimatedCallsQueryVariables = Exact<{
  id: Scalars['String'];
  timeRange?: InputMaybe<Scalars['Int']>;
  numberOfDeparturesPerLineAndDestinationDisplay?: InputMaybe<Scalars['Int']>;
}>;


export type StopPlaceWithEstimatedCallsQuery = { __typename?: 'QueryType', stopPlace: { __typename?: 'StopPlace', id: string, name: string, description: string | null, latitude: number | null, longitude: number | null, transportMode: Array<TransportMode | null> | null, transportSubmode: Array<TransportSubmode | null> | null, estimatedCalls: Array<{ __typename?: 'EstimatedCall', aimedDepartureTime: DateTime, cancellation: boolean, date: Date | null, expectedDepartureTime: DateTime, destinationDisplay: { __typename?: 'DestinationDisplay', frontText: string | null } | null, quay: { __typename?: 'Quay', id: string, name: string, publicCode: string | null } | null, serviceJourney: { __typename?: 'ServiceJourney', id: string, transportSubmode: TransportSubmode | null, journeyPattern: { __typename?: 'JourneyPattern', line: { __typename?: 'Line', publicCode: string | null, transportMode: TransportMode | null } } | null } | null, situations: Array<{ __typename?: 'PtSituationElement', summary: Array<{ __typename?: 'MultilingualString', value: string }> }> }> } | null };

export type UniqueLinesQueryVariables = Exact<{
  ids: Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>;
}>;


export type UniqueLinesQuery = { __typename?: 'QueryType', stopPlaces: Array<{ __typename?: 'StopPlace', id: string, estimatedCalls: Array<{ __typename?: 'EstimatedCall', destinationDisplay: { __typename?: 'DestinationDisplay', frontText: string | null } | null, serviceJourney: { __typename?: 'ServiceJourney', line: { __typename?: 'Line', id: string, transportMode: TransportMode | null, transportSubmode: TransportSubmode | null, publicCode: string | null }, pointsOnLink: { __typename?: 'PointsOnLink', points: string | null } | null } | null }> } | null> };

export type WalkTripQueryVariables = Exact<{
  from: Location;
  to: Location;
}>;


export type WalkTripQuery = { __typename?: 'QueryType', trip: { __typename?: 'Trip', tripPatterns: Array<{ __typename?: 'TripPattern', duration: Long | null, walkDistance: number | null }> } };


export const BusTileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BusTile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"journey_planner_v3"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stopPlaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"transportMode"}},{"kind":"Field","name":{"kind":"Name","value":"transportSubmode"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCalls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"numberOfDepartures"},"value":{"kind":"IntValue","value":"20"}},{"kind":"Argument","name":{"kind":"Name","value":"timeRange"},"value":{"kind":"IntValue","value":"172800"}},{"kind":"Argument","name":{"kind":"Name","value":"numberOfDeparturesPerLineAndDestinationDisplay"},"value":{"kind":"IntValue","value":"20"}},{"kind":"Argument","name":{"kind":"Name","value":"arrivalDeparture"},"value":{"kind":"EnumValue","value":"departures"}},{"kind":"Argument","name":{"kind":"Name","value":"whiteListedModes"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"bus"}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aimedDepartureTime"}},{"kind":"Field","name":{"kind":"Name","value":"cancellation"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"destinationDisplay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"frontText"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expectedDepartureTime"}},{"kind":"Field","name":{"kind":"Name","value":"quay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"publicCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"serviceJourney"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"journeyPattern"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"line"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicCode"}},{"kind":"Field","name":{"kind":"Name","value":"transportMode"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"transportSubmode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"situations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"summary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBusTileQuery__
 *
 * To run a query within a React component, call `useBusTileQuery` and pass it any options that fit your needs.
 * When your component renders, `useBusTileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBusTileQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useBusTileQuery(baseOptions: Apollo.QueryHookOptions<BusTileQuery, BusTileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BusTileQuery, BusTileQueryVariables>(BusTileDocument, options);
      }
export function useBusTileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BusTileQuery, BusTileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BusTileQuery, BusTileQueryVariables>(BusTileDocument, options);
        }
export type BusTileQueryHookResult = ReturnType<typeof useBusTileQuery>;
export type BusTileLazyQueryHookResult = ReturnType<typeof useBusTileLazyQuery>;
export type BusTileQueryResult = Apollo.QueryResult<BusTileQuery, BusTileQueryVariables>;
export const StopPlaceIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StopPlaceIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"latitude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"longitude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"maximumDistance"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filterByPlaceTypes"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterPlaceType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"multiModalMode"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"MultiModalMode"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"journey_planner_v3"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nearest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"latitude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"latitude"}}},{"kind":"Argument","name":{"kind":"Name","value":"longitude"},"value":{"kind":"Variable","name":{"kind":"Name","value":"longitude"}}},{"kind":"Argument","name":{"kind":"Name","value":"maximumDistance"},"value":{"kind":"Variable","name":{"kind":"Name","value":"maximumDistance"}}},{"kind":"Argument","name":{"kind":"Name","value":"filterByPlaceTypes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filterByPlaceTypes"}}},{"kind":"Argument","name":{"kind":"Name","value":"multiModalMode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"multiModalMode"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"place"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useStopPlaceIdsQuery__
 *
 * To run a query within a React component, call `useStopPlaceIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStopPlaceIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStopPlaceIdsQuery({
 *   variables: {
 *      latitude: // value for 'latitude'
 *      longitude: // value for 'longitude'
 *      maximumDistance: // value for 'maximumDistance'
 *      filterByPlaceTypes: // value for 'filterByPlaceTypes'
 *      multiModalMode: // value for 'multiModalMode'
 *   },
 * });
 */
export function useStopPlaceIdsQuery(baseOptions: Apollo.QueryHookOptions<StopPlaceIdsQuery, StopPlaceIdsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StopPlaceIdsQuery, StopPlaceIdsQueryVariables>(StopPlaceIdsDocument, options);
      }
export function useStopPlaceIdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StopPlaceIdsQuery, StopPlaceIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StopPlaceIdsQuery, StopPlaceIdsQueryVariables>(StopPlaceIdsDocument, options);
        }
export type StopPlaceIdsQueryHookResult = ReturnType<typeof useStopPlaceIdsQuery>;
export type StopPlaceIdsLazyQueryHookResult = ReturnType<typeof useStopPlaceIdsLazyQuery>;
export type StopPlaceIdsQueryResult = Apollo.QueryResult<StopPlaceIdsQuery, StopPlaceIdsQueryVariables>;
export const StopPlaceWithEstimatedCallsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StopPlaceWithEstimatedCalls"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"172800"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"numberOfDeparturesPerLineAndDestinationDisplay"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"20"}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"journey_planner_v3"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stopPlace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}},{"kind":"Field","name":{"kind":"Name","value":"transportMode"}},{"kind":"Field","name":{"kind":"Name","value":"transportSubmode"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCalls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"numberOfDepartures"},"value":{"kind":"IntValue","value":"200"}},{"kind":"Argument","name":{"kind":"Name","value":"timeRange"},"value":{"kind":"Variable","name":{"kind":"Name","value":"timeRange"}}},{"kind":"Argument","name":{"kind":"Name","value":"numberOfDeparturesPerLineAndDestinationDisplay"},"value":{"kind":"Variable","name":{"kind":"Name","value":"numberOfDeparturesPerLineAndDestinationDisplay"}}},{"kind":"Argument","name":{"kind":"Name","value":"arrivalDeparture"},"value":{"kind":"EnumValue","value":"departures"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"aimedDepartureTime"}},{"kind":"Field","name":{"kind":"Name","value":"cancellation"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"destinationDisplay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"frontText"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expectedDepartureTime"}},{"kind":"Field","name":{"kind":"Name","value":"quay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"publicCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"serviceJourney"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"journeyPattern"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"line"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicCode"}},{"kind":"Field","name":{"kind":"Name","value":"transportMode"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"transportSubmode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"situations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"summary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useStopPlaceWithEstimatedCallsQuery__
 *
 * To run a query within a React component, call `useStopPlaceWithEstimatedCallsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStopPlaceWithEstimatedCallsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStopPlaceWithEstimatedCallsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      timeRange: // value for 'timeRange'
 *      numberOfDeparturesPerLineAndDestinationDisplay: // value for 'numberOfDeparturesPerLineAndDestinationDisplay'
 *   },
 * });
 */
export function useStopPlaceWithEstimatedCallsQuery(baseOptions: Apollo.QueryHookOptions<StopPlaceWithEstimatedCallsQuery, StopPlaceWithEstimatedCallsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StopPlaceWithEstimatedCallsQuery, StopPlaceWithEstimatedCallsQueryVariables>(StopPlaceWithEstimatedCallsDocument, options);
      }
export function useStopPlaceWithEstimatedCallsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StopPlaceWithEstimatedCallsQuery, StopPlaceWithEstimatedCallsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StopPlaceWithEstimatedCallsQuery, StopPlaceWithEstimatedCallsQueryVariables>(StopPlaceWithEstimatedCallsDocument, options);
        }
export type StopPlaceWithEstimatedCallsQueryHookResult = ReturnType<typeof useStopPlaceWithEstimatedCallsQuery>;
export type StopPlaceWithEstimatedCallsLazyQueryHookResult = ReturnType<typeof useStopPlaceWithEstimatedCallsLazyQuery>;
export type StopPlaceWithEstimatedCallsQueryResult = Apollo.QueryResult<StopPlaceWithEstimatedCallsQuery, StopPlaceWithEstimatedCallsQueryVariables>;
export const UniqueLinesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UniqueLines"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"journey_planner_v3"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stopPlaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedCalls"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"numberOfDeparturesPerLineAndDestinationDisplay"},"value":{"kind":"IntValue","value":"1"}},{"kind":"Argument","name":{"kind":"Name","value":"timeRange"},"value":{"kind":"IntValue","value":"604800"}},{"kind":"Argument","name":{"kind":"Name","value":"numberOfDepartures"},"value":{"kind":"IntValue","value":"200"}},{"kind":"Argument","name":{"kind":"Name","value":"arrivalDeparture"},"value":{"kind":"EnumValue","value":"departures"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"destinationDisplay"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"frontText"}}]}},{"kind":"Field","name":{"kind":"Name","value":"serviceJourney"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"line"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"transportMode"}},{"kind":"Field","name":{"kind":"Name","value":"transportSubmode"}},{"kind":"Field","name":{"kind":"Name","value":"publicCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pointsOnLink"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"points"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useUniqueLinesQuery__
 *
 * To run a query within a React component, call `useUniqueLinesQuery` and pass it any options that fit your needs.
 * When your component renders, `useUniqueLinesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUniqueLinesQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useUniqueLinesQuery(baseOptions: Apollo.QueryHookOptions<UniqueLinesQuery, UniqueLinesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UniqueLinesQuery, UniqueLinesQueryVariables>(UniqueLinesDocument, options);
      }
export function useUniqueLinesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UniqueLinesQuery, UniqueLinesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UniqueLinesQuery, UniqueLinesQueryVariables>(UniqueLinesDocument, options);
        }
export type UniqueLinesQueryHookResult = ReturnType<typeof useUniqueLinesQuery>;
export type UniqueLinesLazyQueryHookResult = ReturnType<typeof useUniqueLinesLazyQuery>;
export type UniqueLinesQueryResult = Apollo.QueryResult<UniqueLinesQuery, UniqueLinesQueryVariables>;
export const WalkTripDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WalkTrip"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Location"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Location"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"journey_planner_v3"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trip"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}},{"kind":"Argument","name":{"kind":"Name","value":"modes"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"directMode"},"value":{"kind":"EnumValue","value":"foot"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"numTripPatterns"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tripPatterns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"walkDistance"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useWalkTripQuery__
 *
 * To run a query within a React component, call `useWalkTripQuery` and pass it any options that fit your needs.
 * When your component renders, `useWalkTripQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWalkTripQuery({
 *   variables: {
 *      from: // value for 'from'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useWalkTripQuery(baseOptions: Apollo.QueryHookOptions<WalkTripQuery, WalkTripQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WalkTripQuery, WalkTripQueryVariables>(WalkTripDocument, options);
      }
export function useWalkTripLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WalkTripQuery, WalkTripQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WalkTripQuery, WalkTripQueryVariables>(WalkTripDocument, options);
        }
export type WalkTripQueryHookResult = ReturnType<typeof useWalkTripQuery>;
export type WalkTripLazyQueryHookResult = ReturnType<typeof useWalkTripLazyQuery>;
export type WalkTripQueryResult = Apollo.QueryResult<WalkTripQuery, WalkTripQueryVariables>;