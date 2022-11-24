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

export type ScooterPanelQueryVariables = Exact<{ [key: string]: never; }>;


export type ScooterPanelQuery = { __typename?: 'Query', operators: Array<{ __typename?: 'Operator', id: string, name: { __typename?: 'TranslatedString', translation: Array<{ __typename?: 'Translation', language: string, value: string } | null> } } | null> | null };

export type OperatorIdsQueryVariables = Exact<{ [key: string]: never; }>;


export type OperatorIdsQuery = { __typename?: 'Query', operators: Array<{ __typename?: 'Operator', id: string } | null> | null };

export type RentalStationsQueryVariables = Exact<{
  ids: Array<Scalars['String']> | Scalars['String'];
}>;


export type RentalStationsQuery = { __typename?: 'Query', stationsById: Array<{ __typename?: 'Station', id: string, lat: number, lon: number, numBikesAvailable: number, numDocksAvailable: number | null, name: { __typename?: 'TranslatedString', translation: Array<{ __typename?: 'Translation', language: string, value: string } | null> } } | null> | null };

export type StationIdsQueryVariables = Exact<{
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  range: Scalars['Int'];
  formFactors?: InputMaybe<Array<InputMaybe<FormFactor>> | InputMaybe<FormFactor>>;
}>;


export type StationIdsQuery = { __typename?: 'Query', stations: Array<{ __typename?: 'Station', id: string } | null> | null };

export type VehiclesQueryVariables = Exact<{
  lat: Scalars['Float'];
  lon: Scalars['Float'];
  range: Scalars['Int'];
  operators?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  formFactors?: InputMaybe<Array<InputMaybe<FormFactor>> | InputMaybe<FormFactor>>;
}>;


export type VehiclesQuery = { __typename?: 'Query', vehicles: Array<{ __typename?: 'Vehicle', id: string, lat: number, lon: number, system: { __typename?: 'System', operator: { __typename?: 'Operator', id: string, name: { __typename?: 'TranslatedString', translation: Array<{ __typename?: 'Translation', language: string, value: string } | null> } } } } | null> | null };

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
export const ScooterPanelQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ScooterPanelQuery"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"mobility"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useScooterPanelQuery__
 *
 * To run a query within a React component, call `useScooterPanelQuery` and pass it any options that fit your needs.
 * When your component renders, `useScooterPanelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScooterPanelQuery({
 *   variables: {
 *   },
 * });
 */
export function useScooterPanelQuery(baseOptions?: Apollo.QueryHookOptions<ScooterPanelQuery, ScooterPanelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ScooterPanelQuery, ScooterPanelQueryVariables>(ScooterPanelQueryDocument, options);
      }
export function useScooterPanelQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ScooterPanelQuery, ScooterPanelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ScooterPanelQuery, ScooterPanelQueryVariables>(ScooterPanelQueryDocument, options);
        }
export type ScooterPanelQueryHookResult = ReturnType<typeof useScooterPanelQuery>;
export type ScooterPanelQueryLazyQueryHookResult = ReturnType<typeof useScooterPanelQueryLazyQuery>;
export type ScooterPanelQueryQueryResult = Apollo.QueryResult<ScooterPanelQuery, ScooterPanelQueryVariables>;
export const OperatorIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OperatorIds"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"mobility"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operators"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useOperatorIdsQuery__
 *
 * To run a query within a React component, call `useOperatorIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOperatorIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOperatorIdsQuery({
 *   variables: {
 *   },
 * });
 */
export function useOperatorIdsQuery(baseOptions?: Apollo.QueryHookOptions<OperatorIdsQuery, OperatorIdsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OperatorIdsQuery, OperatorIdsQueryVariables>(OperatorIdsDocument, options);
      }
export function useOperatorIdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OperatorIdsQuery, OperatorIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OperatorIdsQuery, OperatorIdsQueryVariables>(OperatorIdsDocument, options);
        }
export type OperatorIdsQueryHookResult = ReturnType<typeof useOperatorIdsQuery>;
export type OperatorIdsLazyQueryHookResult = ReturnType<typeof useOperatorIdsLazyQuery>;
export type OperatorIdsQueryResult = Apollo.QueryResult<OperatorIdsQuery, OperatorIdsQueryVariables>;
export const RentalStationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RentalStations"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"mobility"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stationsById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lon"}},{"kind":"Field","name":{"kind":"Name","value":"numBikesAvailable"}},{"kind":"Field","name":{"kind":"Name","value":"numDocksAvailable"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useRentalStationsQuery__
 *
 * To run a query within a React component, call `useRentalStationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRentalStationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRentalStationsQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useRentalStationsQuery(baseOptions: Apollo.QueryHookOptions<RentalStationsQuery, RentalStationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RentalStationsQuery, RentalStationsQueryVariables>(RentalStationsDocument, options);
      }
export function useRentalStationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RentalStationsQuery, RentalStationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RentalStationsQuery, RentalStationsQueryVariables>(RentalStationsDocument, options);
        }
export type RentalStationsQueryHookResult = ReturnType<typeof useRentalStationsQuery>;
export type RentalStationsLazyQueryHookResult = ReturnType<typeof useRentalStationsLazyQuery>;
export type RentalStationsQueryResult = Apollo.QueryResult<RentalStationsQuery, RentalStationsQueryVariables>;
export const StationIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StationIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"latitude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"longitude"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"range"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formFactors"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FormFactor"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"mobility"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stations"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"lat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"latitude"}}},{"kind":"Argument","name":{"kind":"Name","value":"lon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"longitude"}}},{"kind":"Argument","name":{"kind":"Name","value":"range"},"value":{"kind":"Variable","name":{"kind":"Name","value":"range"}}},{"kind":"Argument","name":{"kind":"Name","value":"availableFormFactors"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formFactors"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useStationIdsQuery__
 *
 * To run a query within a React component, call `useStationIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStationIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStationIdsQuery({
 *   variables: {
 *      latitude: // value for 'latitude'
 *      longitude: // value for 'longitude'
 *      range: // value for 'range'
 *      formFactors: // value for 'formFactors'
 *   },
 * });
 */
export function useStationIdsQuery(baseOptions: Apollo.QueryHookOptions<StationIdsQuery, StationIdsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StationIdsQuery, StationIdsQueryVariables>(StationIdsDocument, options);
      }
export function useStationIdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StationIdsQuery, StationIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StationIdsQuery, StationIdsQueryVariables>(StationIdsDocument, options);
        }
export type StationIdsQueryHookResult = ReturnType<typeof useStationIdsQuery>;
export type StationIdsLazyQueryHookResult = ReturnType<typeof useStationIdsLazyQuery>;
export type StationIdsQueryResult = Apollo.QueryResult<StationIdsQuery, StationIdsQueryVariables>;
export const VehiclesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Vehicles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lat"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lon"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"range"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"operators"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"formFactors"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FormFactor"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"mobility"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vehicles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"range"},"value":{"kind":"Variable","name":{"kind":"Name","value":"range"}}},{"kind":"Argument","name":{"kind":"Name","value":"operators"},"value":{"kind":"Variable","name":{"kind":"Name","value":"operators"}}},{"kind":"Argument","name":{"kind":"Name","value":"lon"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lon"}}},{"kind":"Argument","name":{"kind":"Name","value":"lat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lat"}}},{"kind":"Argument","name":{"kind":"Name","value":"count"},"value":{"kind":"IntValue","value":"100"}},{"kind":"Argument","name":{"kind":"Name","value":"formFactors"},"value":{"kind":"Variable","name":{"kind":"Name","value":"formFactors"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeReserved"},"value":{"kind":"BooleanValue","value":false}},{"kind":"Argument","name":{"kind":"Name","value":"includeDisabled"},"value":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lon"}},{"kind":"Field","name":{"kind":"Name","value":"system"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"translation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useVehiclesQuery__
 *
 * To run a query within a React component, call `useVehiclesQuery` and pass it any options that fit your needs.
 * When your component renders, `useVehiclesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVehiclesQuery({
 *   variables: {
 *      lat: // value for 'lat'
 *      lon: // value for 'lon'
 *      range: // value for 'range'
 *      operators: // value for 'operators'
 *      formFactors: // value for 'formFactors'
 *   },
 * });
 */
export function useVehiclesQuery(baseOptions: Apollo.QueryHookOptions<VehiclesQuery, VehiclesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VehiclesQuery, VehiclesQueryVariables>(VehiclesDocument, options);
      }
export function useVehiclesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VehiclesQuery, VehiclesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VehiclesQuery, VehiclesQueryVariables>(VehiclesDocument, options);
        }
export type VehiclesQueryHookResult = ReturnType<typeof useVehiclesQuery>;
export type VehiclesLazyQueryHookResult = ReturnType<typeof useVehiclesLazyQuery>;
export type VehiclesQueryResult = Apollo.QueryResult<VehiclesQuery, VehiclesQueryVariables>;