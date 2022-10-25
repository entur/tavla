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
};

export type BrandAssets = {
  __typename?: 'BrandAssets';
  brandImageUrl: Scalars['String'];
  brandImageUrlDark: Maybe<Scalars['String']>;
  brandLastModified: Scalars['String'];
  brandTermsUrl: Maybe<Scalars['String']>;
  color: Maybe<Scalars['String']>;
};

export type EcoLabel = {
  __typename?: 'EcoLabel';
  countryCode: Scalars['String'];
  ecoSticker: Scalars['String'];
};

export type Feature = {
  __typename?: 'Feature';
  geometry: Maybe<MultiPolygon>;
  properties: Maybe<GeofencingZoneProperties>;
  type: Maybe<Scalars['String']>;
};

export type FeatureCollection = {
  __typename?: 'FeatureCollection';
  features: Maybe<Array<Maybe<Feature>>>;
  type: Maybe<Scalars['String']>;
};

export enum FormFactor {
  Bicycle = 'BICYCLE',
  Car = 'CAR',
  CargoBicycle = 'CARGO_BICYCLE',
  Moped = 'MOPED',
  Other = 'OTHER',
  Scooter = 'SCOOTER',
  ScooterSeated = 'SCOOTER_SEATED',
  ScooterStanding = 'SCOOTER_STANDING'
}

export type GeofencingZoneProperties = {
  __typename?: 'GeofencingZoneProperties';
  end: Maybe<Scalars['Int']>;
  name: Maybe<Scalars['String']>;
  rules: Maybe<Array<Maybe<GeofencingZoneRule>>>;
  start: Maybe<Scalars['Int']>;
};

export type GeofencingZoneRule = {
  __typename?: 'GeofencingZoneRule';
  maximumSpeedKph: Maybe<Scalars['Int']>;
  rideAllowed: Scalars['Boolean'];
  rideThroughAllowed: Scalars['Boolean'];
  stationParking: Maybe<Scalars['Boolean']>;
  vehicleTypeIds: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type GeofencingZones = {
  __typename?: 'GeofencingZones';
  geojson: Maybe<FeatureCollection>;
  systemId: Maybe<Scalars['ID']>;
};

export type MultiPolygon = {
  __typename?: 'MultiPolygon';
  coordinates: Maybe<Array<Maybe<Array<Maybe<Array<Maybe<Array<Maybe<Scalars['Float']>>>>>>>>>;
  type: Maybe<Scalars['String']>;
};

export type Operator = {
  __typename?: 'Operator';
  id: Scalars['ID'];
  name: TranslatedString;
};

export enum ParkingType {
  Other = 'OTHER',
  ParkingLot = 'PARKING_LOT',
  SidewalkParking = 'SIDEWALK_PARKING',
  StreetParking = 'STREET_PARKING',
  UndergroundParking = 'UNDERGROUND_PARKING'
}

export type PricingPlan = {
  __typename?: 'PricingPlan';
  currency: Scalars['String'];
  description: TranslatedString;
  id: Scalars['ID'];
  isTaxable: Scalars['Boolean'];
  name: TranslatedString;
  perKmPricing: Maybe<Array<Maybe<PricingSegment>>>;
  perMinPricing: Maybe<Array<Maybe<PricingSegment>>>;
  price: Scalars['Float'];
  surgePricing: Maybe<Scalars['Boolean']>;
  url: Maybe<Scalars['String']>;
};

export type PricingSegment = {
  __typename?: 'PricingSegment';
  end: Maybe<Scalars['Int']>;
  interval: Scalars['Int'];
  rate: Scalars['Float'];
  start: Scalars['Int'];
};

export enum PropulsionType {
  Combustion = 'COMBUSTION',
  CombustionDiesel = 'COMBUSTION_DIESEL',
  Electric = 'ELECTRIC',
  ElectricAssist = 'ELECTRIC_ASSIST',
  Human = 'HUMAN',
  Hybrid = 'HYBRID',
  HydrogenFuelCell = 'HYDROGEN_FUEL_CELL',
  PlugInHybrid = 'PLUG_IN_HYBRID'
}

export type Query = {
  __typename?: 'Query';
  codespaces: Maybe<Array<Maybe<Scalars['String']>>>;
  geofencingZones: Maybe<Array<Maybe<GeofencingZones>>>;
  operators: Maybe<Array<Maybe<Operator>>>;
  stations: Maybe<Array<Maybe<Station>>>;
  stationsById: Maybe<Array<Maybe<Station>>>;
  vehicles: Maybe<Array<Maybe<Vehicle>>>;
};


export type QueryGeofencingZonesArgs = {
  systemIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};


export type QueryStationsArgs = {
  availableFormFactors?: InputMaybe<Array<InputMaybe<FormFactor>>>;
  availablePropulsionTypes?: InputMaybe<Array<InputMaybe<PropulsionType>>>;
  codespaces?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  count?: InputMaybe<Scalars['Int']>;
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  operators?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  range: Scalars['Int'];
  systems?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryStationsByIdArgs = {
  ids: Array<InputMaybe<Scalars['String']>>;
};


export type QueryVehiclesArgs = {
  codespaces?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  count?: InputMaybe<Scalars['Int']>;
  formFactors?: InputMaybe<Array<InputMaybe<FormFactor>>>;
  includeDisabled?: InputMaybe<Scalars['Boolean']>;
  includeReserved?: InputMaybe<Scalars['Boolean']>;
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  operators?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  propulsionTypes?: InputMaybe<Array<InputMaybe<PropulsionType>>>;
  range: Scalars['Int'];
  systems?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Region = {
  __typename?: 'Region';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type RentalApp = {
  __typename?: 'RentalApp';
  discoveryUri: Maybe<Scalars['String']>;
  storeUri: Maybe<Scalars['String']>;
};

export type RentalApps = {
  __typename?: 'RentalApps';
  android: Maybe<RentalApp>;
  ios: Maybe<RentalApp>;
};

export enum RentalMethod {
  Accountnumber = 'ACCOUNTNUMBER',
  Androidpay = 'ANDROIDPAY',
  Appleplay = 'APPLEPLAY',
  Creditcard = 'CREDITCARD',
  Key = 'KEY',
  Paypass = 'PAYPASS',
  Phone = 'PHONE',
  Transitcard = 'TRANSITCARD'
}

export type RentalUris = {
  __typename?: 'RentalUris';
  android: Maybe<Scalars['String']>;
  ios: Maybe<Scalars['String']>;
  web: Maybe<Scalars['String']>;
};

export enum ReturnConstraint {
  AnyStation = 'ANY_STATION',
  FreeFloating = 'FREE_FLOATING',
  Hybrid = 'HYBRID',
  RoundtripStation = 'ROUNDTRIP_STATION'
}

export type Station = {
  __typename?: 'Station';
  address: Maybe<Scalars['String']>;
  capacity: Maybe<Scalars['Int']>;
  contactPhone: Maybe<Scalars['String']>;
  crossStreet: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isChargingStation: Maybe<Scalars['Boolean']>;
  isInstalled: Scalars['Boolean'];
  isRenting: Scalars['Boolean'];
  isReturning: Scalars['Boolean'];
  isValetStation: Maybe<Scalars['Boolean']>;
  isVirtualStation: Maybe<Scalars['Boolean']>;
  lastReported: Scalars['Int'];
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  name: TranslatedString;
  numBikesAvailable: Scalars['Int'];
  numBikesDisabled: Maybe<Scalars['Int']>;
  numDocksAvailable: Maybe<Scalars['Int']>;
  numDocksDisabled: Maybe<Scalars['Int']>;
  parkingHoop: Maybe<Scalars['Boolean']>;
  parkingType: Maybe<ParkingType>;
  postCode: Maybe<Scalars['String']>;
  pricingPlans: Array<Maybe<PricingPlan>>;
  region: Maybe<Region>;
  rentalMethods: Maybe<Array<Maybe<RentalMethod>>>;
  rentalUris: Maybe<RentalUris>;
  shortName: Maybe<TranslatedString>;
  stationArea: Maybe<MultiPolygon>;
  system: System;
  vehicleCapacity: Maybe<Array<Maybe<VehicleTypeCapacity>>>;
  vehicleDocksAvailable: Maybe<Array<Maybe<VehicleDocksAvailability>>>;
  vehicleTypeCapacity: Maybe<Array<Maybe<VehicleTypeCapacity>>>;
  vehicleTypesAvailable: Maybe<Array<Maybe<VehicleTypeAvailability>>>;
};

export type System = {
  __typename?: 'System';
  brandAssets: Maybe<BrandAssets>;
  email: Maybe<Scalars['String']>;
  feedContactEmail: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  language: Scalars['String'];
  licenseUrl: Maybe<Scalars['String']>;
  name: TranslatedString;
  operator: Operator;
  phoneNumber: Maybe<Scalars['String']>;
  privacyLastUpdated: Maybe<Scalars['String']>;
  privacyUrl: Maybe<Scalars['String']>;
  purchaseUrl: Maybe<Scalars['String']>;
  rentalApps: Maybe<RentalApps>;
  shortName: Maybe<TranslatedString>;
  startDate: Maybe<Scalars['String']>;
  termsLastUpdated: Maybe<Scalars['String']>;
  termsUrl: Maybe<Scalars['String']>;
  timezone: Scalars['String'];
  url: Maybe<Scalars['String']>;
};

export type TranslatedString = {
  __typename?: 'TranslatedString';
  translation: Array<Maybe<Translation>>;
};

export type Translation = {
  __typename?: 'Translation';
  language: Scalars['String'];
  value: Scalars['String'];
};

export type Vehicle = {
  __typename?: 'Vehicle';
  availableUntil: Maybe<Scalars['String']>;
  currentFuelPercent: Maybe<Scalars['Float']>;
  currentRangeMeters: Scalars['Float'];
  id: Scalars['ID'];
  isDisabled: Scalars['Boolean'];
  isReserved: Scalars['Boolean'];
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  pricingPlan: PricingPlan;
  rentalUris: Maybe<RentalUris>;
  system: System;
  vehicleEquipment: Maybe<Array<Maybe<VehicleEquipment>>>;
  vehicleType: VehicleType;
};

export enum VehicleAccessory {
  AirConditioning = 'AIR_CONDITIONING',
  Automatic = 'AUTOMATIC',
  Convertible = 'CONVERTIBLE',
  CruiseControl = 'CRUISE_CONTROL',
  Doors_2 = 'DOORS_2',
  Doors_3 = 'DOORS_3',
  Doors_4 = 'DOORS_4',
  Doors_5 = 'DOORS_5',
  Manual = 'MANUAL',
  Navigation = 'NAVIGATION'
}

export type VehicleAssets = {
  __typename?: 'VehicleAssets';
  iconLastModified: Scalars['String'];
  iconUrl: Scalars['String'];
  iconUrlDark: Maybe<Scalars['String']>;
};

export type VehicleDocksAvailability = {
  __typename?: 'VehicleDocksAvailability';
  count: Scalars['Int'];
  vehicleTypes: Array<Maybe<VehicleType>>;
};

export enum VehicleEquipment {
  ChildSeatA = 'CHILD_SEAT_A',
  ChildSeatB = 'CHILD_SEAT_B',
  ChildSeatC = 'CHILD_SEAT_C',
  SnowChains = 'SNOW_CHAINS',
  WinterTires = 'WINTER_TIRES'
}

export type VehicleType = {
  __typename?: 'VehicleType';
  cargoLoadCapacity: Maybe<Scalars['Int']>;
  cargoVolumeCapacity: Maybe<Scalars['Int']>;
  color: Maybe<Scalars['String']>;
  defaultPricingPlan: Maybe<PricingPlan>;
  defaultReserveTime: Maybe<Scalars['Int']>;
  ecoLabel: Maybe<Array<Maybe<EcoLabel>>>;
  formFactor: FormFactor;
  gCO2km: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  make: Maybe<Scalars['String']>;
  maxPermittedSpeed: Maybe<Scalars['Int']>;
  maxRangeMeters: Maybe<Scalars['Float']>;
  model: Maybe<Scalars['String']>;
  name: Maybe<TranslatedString>;
  pricingPlans: Maybe<Array<Maybe<PricingPlan>>>;
  propulsionType: PropulsionType;
  ratedPower: Maybe<Scalars['Int']>;
  returnConstraint: Maybe<ReturnConstraint>;
  riderCapacity: Maybe<Scalars['Int']>;
  vehicleAccessories: Maybe<Array<Maybe<VehicleAccessory>>>;
  vehicleAssets: Maybe<VehicleAssets>;
  vehicleImage: Maybe<Scalars['String']>;
  wheelCount: Maybe<Scalars['Int']>;
};

export type VehicleTypeAvailability = {
  __typename?: 'VehicleTypeAvailability';
  count: Scalars['Int'];
  vehicleType: VehicleType;
};

export type VehicleTypeCapacity = {
  __typename?: 'VehicleTypeCapacity';
  count: Scalars['Int'];
  vehicleType: VehicleType;
};

export type BikePanelSearchStationFragment = { __typename?: 'Station', id: string, name: { __typename?: 'TranslatedString', translation: Array<{ __typename?: 'Translation', language: string, value: string } | null> } };

export type BikePanelSearchQueryVariables = Exact<{
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  range: Scalars['Int'];
}>;


export type BikePanelSearchQuery = { __typename?: 'Query', stations: Array<{ __typename?: 'Station', id: string, name: { __typename?: 'TranslatedString', translation: Array<{ __typename?: 'Translation', language: string, value: string } | null> } } | null> | null };

export type GetNearbyStationsQueryVariables = Exact<{
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  range: Scalars['Int'];
  count?: InputMaybe<Scalars['Int']>;
  codespaces?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  systems?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  operators?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;


export type GetNearbyStationsQuery = { __typename?: 'Query', stations: Array<{ __typename?: 'Station', id: string } | null> | null };

export type GetStationsByIdQueryVariables = Exact<{
  stationIds: Array<Scalars['String']> | Scalars['String'];
}>;


export type GetStationsByIdQuery = { __typename?: 'Query', stationsById: Array<{ __typename?: 'Station', id: string, lat: number, lon: number, address: string | null, capacity: number | null, numBikesAvailable: number, numDocksAvailable: number | null, isInstalled: boolean, isRenting: boolean, isReturning: boolean, lastReported: number, name: { __typename?: 'TranslatedString', translation: Array<{ __typename?: 'Translation', language: string, value: string } | null> }, rentalUris: { __typename?: 'RentalUris', android: string | null, ios: string | null, web: string | null } | null, system: { __typename?: 'System', id: string, language: string, url: string | null, purchaseUrl: string | null, startDate: string | null, phoneNumber: string | null, email: string | null, feedContactEmail: string | null, timezone: string, licenseUrl: string | null, name: { __typename?: 'TranslatedString', translation: Array<{ __typename?: 'Translation', language: string, value: string } | null> }, shortName: { __typename?: 'TranslatedString', translation: Array<{ __typename?: 'Translation', language: string, value: string } | null> } | null, operator: { __typename?: 'Operator', id: string, name: { __typename?: 'TranslatedString', translation: Array<{ __typename?: 'Translation', language: string, value: string } | null> } }, rentalApps: { __typename?: 'RentalApps', ios: { __typename?: 'RentalApp', storeUri: string | null, discoveryUri: string | null } | null, android: { __typename?: 'RentalApp', storeUri: string | null, discoveryUri: string | null } | null } | null }, pricingPlans: Array<{ __typename?: 'PricingPlan', id: string, url: string | null, currency: string, price: number, isTaxable: boolean, surgePricing: boolean | null, name: { __typename?: 'TranslatedString', translation: Array<{ __typename?: 'Translation', language: string, value: string } | null> }, description: { __typename?: 'TranslatedString', translation: Array<{ __typename?: 'Translation', language: string, value: string } | null> }, perKmPricing: Array<{ __typename?: 'PricingSegment', start: number, rate: number, interval: number, end: number | null } | null> | null, perMinPricing: Array<{ __typename?: 'PricingSegment', start: number, rate: number, interval: number, end: number | null } | null> | null } | null>, vehicleTypesAvailable: Array<{ __typename?: 'VehicleTypeAvailability', count: number, vehicleType: { __typename?: 'VehicleType', formFactor: FormFactor, propulsionType: PropulsionType, id: string, maxRangeMeters: number | null, name: { __typename?: 'TranslatedString', translation: Array<{ __typename?: 'Translation', language: string, value: string } | null> } | null } } | null> | null } | null> | null };

export type GetOperatorsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOperatorsQuery = { __typename?: 'Query', operators: Array<{ __typename?: 'Operator', id: string, name: { __typename?: 'TranslatedString', translation: Array<{ __typename?: 'Translation', language: string, value: string } | null> } } | null> | null };

export type GetVehiclesQueryVariables = Exact<{
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  range: Scalars['Int'];
  count?: InputMaybe<Scalars['Int']>;
  operators?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  codespaces?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  formFactors?: InputMaybe<Array<InputMaybe<FormFactor>> | InputMaybe<FormFactor>>;
  propulsionTypes?: InputMaybe<Array<InputMaybe<PropulsionType>> | InputMaybe<PropulsionType>>;
  includeReserved?: InputMaybe<Scalars['Boolean']>;
  includeDisabled?: InputMaybe<Scalars['Boolean']>;
}>;


export type GetVehiclesQuery = { __typename?: 'Query', vehicles: Array<{ __typename?: 'Vehicle', lat: number, lon: number, isDisabled: boolean, isReserved: boolean, id: string, currentRangeMeters: number, vehicleType: { __typename?: 'VehicleType', id: string, formFactor: FormFactor, propulsionType: PropulsionType }, pricingPlan: { __typename?: 'PricingPlan', id: string, currency: string, isTaxable: boolean, price: number, surgePricing: boolean | null, url: string | null, description: { __typename?: 'TranslatedString', translation: Array<{ __typename?: 'Translation', language: string, value: string } | null> }, name: { __typename?: 'TranslatedString', translation: Array<{ __typename?: 'Translation', language: string, value: string } | null> }, perKmPricing: Array<{ __typename?: 'PricingSegment', start: number, rate: number, interval: number, end: number | null } | null> | null, perMinPricing: Array<{ __typename?: 'PricingSegment', start: number, rate: number, interval: number, end: number | null } | null> | null }, system: { __typename?: 'System', email: string | null, feedContactEmail: string | null, id: string, licenseUrl: string | null, language: string, phoneNumber: string | null, purchaseUrl: string | null, startDate: string | null, timezone: string, url: string | null, name: { __typename?: 'TranslatedString', translation: Array<{ __typename?: 'Translation', language: string, value: string } | null> }, operator: { __typename?: 'Operator', id: string, name: { __typename?: 'TranslatedString', translation: Array<{ __typename?: 'Translation', language: string, value: string } | null> } }, shortName: { __typename?: 'TranslatedString', translation: Array<{ __typename?: 'Translation', language: string, value: string } | null> } | null, rentalApps: { __typename?: 'RentalApps', ios: { __typename?: 'RentalApp', storeUri: string | null, discoveryUri: string | null } | null, android: { __typename?: 'RentalApp', storeUri: string | null, discoveryUri: string | null } | null } | null }, rentalUris: { __typename?: 'RentalUris', android: string | null, ios: string | null, web: string | null } | null } | null> | null };

export const BikePanelSearchStationFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BikePanelSearchStation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Station"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode;
export const BikePanelSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BikePanelSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lat"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lon"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"range"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"mobility"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lon"}}},{"kind":"Argument","name":{"kind":"Name","value":"lat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lat"}}},{"kind":"Argument","name":{"kind":"Name","value":"range"},"value":{"kind":"Variable","name":{"kind":"Name","value":"range"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BikePanelSearchStation"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BikePanelSearchStation"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Station"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBikePanelSearchQuery__
 *
 * To run a query within a React component, call `useBikePanelSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useBikePanelSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBikePanelSearchQuery({
 *   variables: {
 *      lat: // value for 'lat'
 *      lon: // value for 'lon'
 *      range: // value for 'range'
 *   },
 * });
 */
export function useBikePanelSearchQuery(baseOptions: Apollo.QueryHookOptions<BikePanelSearchQuery, BikePanelSearchQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BikePanelSearchQuery, BikePanelSearchQueryVariables>(BikePanelSearchDocument, options);
      }
export function useBikePanelSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BikePanelSearchQuery, BikePanelSearchQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BikePanelSearchQuery, BikePanelSearchQueryVariables>(BikePanelSearchDocument, options);
        }
export type BikePanelSearchQueryHookResult = ReturnType<typeof useBikePanelSearchQuery>;
export type BikePanelSearchLazyQueryHookResult = ReturnType<typeof useBikePanelSearchLazyQuery>;
export type BikePanelSearchQueryResult = Apollo.QueryResult<BikePanelSearchQuery, BikePanelSearchQueryVariables>;
export const GetNearbyStationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNearbyStations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lat"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lon"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"range"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"count"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"codespaces"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"systems"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"operators"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"mobility"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lon"}}},{"kind":"Argument","name":{"kind":"Name","value":"lat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lat"}}},{"kind":"Argument","name":{"kind":"Name","value":"range"},"value":{"kind":"Variable","name":{"kind":"Name","value":"range"}}},{"kind":"Argument","name":{"kind":"Name","value":"count"},"value":{"kind":"Variable","name":{"kind":"Name","value":"count"}}},{"kind":"Argument","name":{"kind":"Name","value":"codespaces"},"value":{"kind":"Variable","name":{"kind":"Name","value":"codespaces"}}},{"kind":"Argument","name":{"kind":"Name","value":"systems"},"value":{"kind":"Variable","name":{"kind":"Name","value":"systems"}}},{"kind":"Argument","name":{"kind":"Name","value":"operators"},"value":{"kind":"Variable","name":{"kind":"Name","value":"operators"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useGetNearbyStationsQuery__
 *
 * To run a query within a React component, call `useGetNearbyStationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNearbyStationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNearbyStationsQuery({
 *   variables: {
 *      lat: // value for 'lat'
 *      lon: // value for 'lon'
 *      range: // value for 'range'
 *      count: // value for 'count'
 *      codespaces: // value for 'codespaces'
 *      systems: // value for 'systems'
 *      operators: // value for 'operators'
 *   },
 * });
 */
export function useGetNearbyStationsQuery(baseOptions: Apollo.QueryHookOptions<GetNearbyStationsQuery, GetNearbyStationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNearbyStationsQuery, GetNearbyStationsQueryVariables>(GetNearbyStationsDocument, options);
      }
export function useGetNearbyStationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNearbyStationsQuery, GetNearbyStationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNearbyStationsQuery, GetNearbyStationsQueryVariables>(GetNearbyStationsDocument, options);
        }
export type GetNearbyStationsQueryHookResult = ReturnType<typeof useGetNearbyStationsQuery>;
export type GetNearbyStationsLazyQueryHookResult = ReturnType<typeof useGetNearbyStationsLazyQuery>;
export type GetNearbyStationsQueryResult = Apollo.QueryResult<GetNearbyStationsQuery, GetNearbyStationsQueryVariables>;
export const GetStationsByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStationsById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stationIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"mobility"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stationsById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stationIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lon"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"rentalUris"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"android"}},{"kind":"Field","name":{"kind":"Name","value":"ios"}},{"kind":"Field","name":{"kind":"Name","value":"web"}}]}},{"kind":"Field","name":{"kind":"Name","value":"numBikesAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"numDocksAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"isInstalled"}},{"kind":"Field","name":{"kind":"Name","value":"isRenting"}},{"kind":"Field","name":{"kind":"Name","value":"isReturning"}},{"kind":"Field","name":{"kind":"Name","value":"lastReported"}},{"kind":"Field","name":{"kind":"Name","value":"system"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shortName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"operator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"purchaseUrl"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"feedContactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"licenseUrl"}},{"kind":"Field","name":{"kind":"Name","value":"rentalApps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ios"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storeUri"}},{"kind":"Field","name":{"kind":"Name","value":"discoveryUri"}}]}},{"kind":"Field","name":{"kind":"Name","value":"android"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storeUri"}},{"kind":"Field","name":{"kind":"Name","value":"discoveryUri"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pricingPlans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"isTaxable"}},{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"perKmPricing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"perMinPricing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"surgePricing"}}]}},{"kind":"Field","name":{"kind":"Name","value":"vehicleTypesAvailable"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vehicleType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"formFactor"}},{"kind":"Field","name":{"kind":"Name","value":"propulsionType"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"maxRangeMeters"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useGetStationsByIdQuery__
 *
 * To run a query within a React component, call `useGetStationsByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStationsByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStationsByIdQuery({
 *   variables: {
 *      stationIds: // value for 'stationIds'
 *   },
 * });
 */
export function useGetStationsByIdQuery(baseOptions: Apollo.QueryHookOptions<GetStationsByIdQuery, GetStationsByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStationsByIdQuery, GetStationsByIdQueryVariables>(GetStationsByIdDocument, options);
      }
export function useGetStationsByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStationsByIdQuery, GetStationsByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStationsByIdQuery, GetStationsByIdQueryVariables>(GetStationsByIdDocument, options);
        }
export type GetStationsByIdQueryHookResult = ReturnType<typeof useGetStationsByIdQuery>;
export type GetStationsByIdLazyQueryHookResult = ReturnType<typeof useGetStationsByIdLazyQuery>;
export type GetStationsByIdQueryResult = Apollo.QueryResult<GetStationsByIdQuery, GetStationsByIdQueryVariables>;
export const GetOperatorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOperators"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"mobility"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useGetOperatorsQuery__
 *
 * To run a query within a React component, call `useGetOperatorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOperatorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOperatorsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetOperatorsQuery(baseOptions?: Apollo.QueryHookOptions<GetOperatorsQuery, GetOperatorsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOperatorsQuery, GetOperatorsQueryVariables>(GetOperatorsDocument, options);
      }
export function useGetOperatorsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOperatorsQuery, GetOperatorsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOperatorsQuery, GetOperatorsQueryVariables>(GetOperatorsDocument, options);
        }
export type GetOperatorsQueryHookResult = ReturnType<typeof useGetOperatorsQuery>;
export type GetOperatorsLazyQueryHookResult = ReturnType<typeof useGetOperatorsLazyQuery>;
export type GetOperatorsQueryResult = Apollo.QueryResult<GetOperatorsQuery, GetOperatorsQueryVariables>;
export const GetVehiclesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVehicles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lat"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lon"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"range"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"count"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"operators"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"codespaces"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formFactors"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FormFactor"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"propulsionTypes"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PropulsionType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeReserved"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeDisabled"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}},"defaultValue":{"kind":"BooleanValue","value":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"mobility"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vehicles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"range"},"value":{"kind":"Variable","name":{"kind":"Name","value":"range"}}},{"kind":"Argument","name":{"kind":"Name","value":"propulsionTypes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"propulsionTypes"}}},{"kind":"Argument","name":{"kind":"Name","value":"operators"},"value":{"kind":"Variable","name":{"kind":"Name","value":"operators"}}},{"kind":"Argument","name":{"kind":"Name","value":"codespaces"},"value":{"kind":"Variable","name":{"kind":"Name","value":"codespaces"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeReserved"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeReserved"}}},{"kind":"Argument","name":{"kind":"Name","value":"lon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lon"}}},{"kind":"Argument","name":{"kind":"Name","value":"lat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lat"}}},{"kind":"Argument","name":{"kind":"Name","value":"count"},"value":{"kind":"Variable","name":{"kind":"Name","value":"count"}}},{"kind":"Argument","name":{"kind":"Name","value":"formFactors"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formFactors"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeDisabled"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeDisabled"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lon"}},{"kind":"Field","name":{"kind":"Name","value":"vehicleType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"formFactor"}},{"kind":"Field","name":{"kind":"Name","value":"propulsionType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pricingPlan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"isTaxable"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"perKmPricing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"perMinPricing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"rate"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"end"}}]}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"surgePricing"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"system"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"feedContactEmail"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"licenseUrl"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"operator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"purchaseUrl"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"shortName"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"rentalApps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ios"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storeUri"}},{"kind":"Field","name":{"kind":"Name","value":"discoveryUri"}}]}},{"kind":"Field","name":{"kind":"Name","value":"android"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"storeUri"}},{"kind":"Field","name":{"kind":"Name","value":"discoveryUri"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"isDisabled"}},{"kind":"Field","name":{"kind":"Name","value":"isReserved"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"currentRangeMeters"}},{"kind":"Field","name":{"kind":"Name","value":"rentalUris"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"android"}},{"kind":"Field","name":{"kind":"Name","value":"ios"}},{"kind":"Field","name":{"kind":"Name","value":"web"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useGetVehiclesQuery__
 *
 * To run a query within a React component, call `useGetVehiclesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVehiclesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVehiclesQuery({
 *   variables: {
 *      lat: // value for 'lat'
 *      lon: // value for 'lon'
 *      range: // value for 'range'
 *      count: // value for 'count'
 *      operators: // value for 'operators'
 *      codespaces: // value for 'codespaces'
 *      formFactors: // value for 'formFactors'
 *      propulsionTypes: // value for 'propulsionTypes'
 *      includeReserved: // value for 'includeReserved'
 *      includeDisabled: // value for 'includeDisabled'
 *   },
 * });
 */
export function useGetVehiclesQuery(baseOptions: Apollo.QueryHookOptions<GetVehiclesQuery, GetVehiclesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVehiclesQuery, GetVehiclesQueryVariables>(GetVehiclesDocument, options);
      }
export function useGetVehiclesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVehiclesQuery, GetVehiclesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVehiclesQuery, GetVehiclesQueryVariables>(GetVehiclesDocument, options);
        }
export type GetVehiclesQueryHookResult = ReturnType<typeof useGetVehiclesQuery>;
export type GetVehiclesLazyQueryHookResult = ReturnType<typeof useGetVehiclesLazyQuery>;
export type GetVehiclesQueryResult = Apollo.QueryResult<GetVehiclesQuery, GetVehiclesQueryVariables>;