import { DateTime } from '../src/types/VehiclesV1';
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
  DateTime: DateTime;
};

export type BoundingBox = {
  maxLat: Scalars['Float'];
  maxLon: Scalars['Float'];
  minLat: Scalars['Float'];
  minLon: Scalars['Float'];
};

export type Codespace = {
  __typename?: 'Codespace';
  codespaceId: Scalars['String'];
};

export type Line = {
  __typename?: 'Line';
  lineName: Maybe<Scalars['String']>;
  lineRef: Maybe<Scalars['String']>;
  publicCode: Maybe<Scalars['String']>;
};

export type Location = {
  __typename?: 'Location';
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
};

export type Operator = {
  __typename?: 'Operator';
  operatorRef: Scalars['String'];
};

export type PointsOnLink = {
  __typename?: 'PointsOnLink';
  length: Maybe<Scalars['Float']>;
  points: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  codespaces: Maybe<Array<Maybe<Codespace>>>;
  lines: Maybe<Array<Maybe<Line>>>;
  operators: Maybe<Array<Maybe<Operator>>>;
  serviceJourney: Maybe<ServiceJourney>;
  serviceJourneys: Maybe<Array<Maybe<ServiceJourney>>>;
  vehicles: Maybe<Array<Maybe<VehicleUpdate>>>;
};


export type QueryLinesArgs = {
  codespaceId?: InputMaybe<Scalars['String']>;
};


export type QueryOperatorsArgs = {
  codespaceId: Scalars['String'];
};


export type QueryServiceJourneyArgs = {
  id: Scalars['String'];
};


export type QueryServiceJourneysArgs = {
  lineRef: Scalars['String'];
};


export type QueryVehiclesArgs = {
  boundingBox?: InputMaybe<BoundingBox>;
  codespaceId?: InputMaybe<Scalars['String']>;
  lineName?: InputMaybe<Scalars['String']>;
  lineRef?: InputMaybe<Scalars['String']>;
  mode?: InputMaybe<VehicleModeEnumeration>;
  monitored?: InputMaybe<Scalars['Boolean']>;
  operatorRef?: InputMaybe<Scalars['String']>;
  serviceJourneyId?: InputMaybe<Scalars['String']>;
  vehicleId?: InputMaybe<Scalars['String']>;
};

export type ServiceJourney = {
  __typename?: 'ServiceJourney';
  id: Scalars['String'];
  /** @deprecated Experimental - should not be used with subscription */
  pointsOnLink: Maybe<PointsOnLink>;
  /** @deprecated Use 'id' instead. */
  serviceJourneyId: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  /** @deprecated Use 'vehicles'. */
  vehicleUpdates: Maybe<Array<Maybe<VehicleUpdate>>>;
  vehicles: Maybe<Array<Maybe<VehicleUpdate>>>;
};


export type SubscriptionVehicleUpdatesArgs = {
  boundingBox?: InputMaybe<BoundingBox>;
  bufferSize?: InputMaybe<Scalars['Int']>;
  bufferTime?: InputMaybe<Scalars['Int']>;
  codespaceId?: InputMaybe<Scalars['String']>;
  lineName?: InputMaybe<Scalars['String']>;
  lineRef?: InputMaybe<Scalars['String']>;
  mode?: InputMaybe<VehicleModeEnumeration>;
  monitored?: InputMaybe<Scalars['Boolean']>;
  operatorRef?: InputMaybe<Scalars['String']>;
  serviceJourneyId?: InputMaybe<Scalars['String']>;
  vehicleId?: InputMaybe<Scalars['String']>;
};


export type SubscriptionVehiclesArgs = {
  boundingBox?: InputMaybe<BoundingBox>;
  bufferSize?: InputMaybe<Scalars['Int']>;
  bufferTime?: InputMaybe<Scalars['Int']>;
  codespaceId?: InputMaybe<Scalars['String']>;
  lineName?: InputMaybe<Scalars['String']>;
  lineRef?: InputMaybe<Scalars['String']>;
  mode?: InputMaybe<VehicleModeEnumeration>;
  monitored?: InputMaybe<Scalars['Boolean']>;
  operatorRef?: InputMaybe<Scalars['String']>;
  serviceJourneyId?: InputMaybe<Scalars['String']>;
  vehicleId?: InputMaybe<Scalars['String']>;
};

export enum VehicleModeEnumeration {
  Air = 'AIR',
  Bus = 'BUS',
  Coach = 'COACH',
  Ferry = 'FERRY',
  Metro = 'METRO',
  Rail = 'RAIL',
  Tram = 'TRAM'
}

export type VehicleUpdate = {
  __typename?: 'VehicleUpdate';
  bearing: Maybe<Scalars['Float']>;
  codespace: Maybe<Codespace>;
  /** The current delay in seconds - negative delay means ahead of schedule */
  delay: Maybe<Scalars['Float']>;
  direction: Maybe<Scalars['String']>;
  expiration: Maybe<Scalars['DateTime']>;
  expirationEpochSecond: Maybe<Scalars['Float']>;
  /** @deprecated Use 'bearing''. */
  heading: Maybe<Scalars['Float']>;
  lastUpdated: Maybe<Scalars['DateTime']>;
  lastUpdatedEpochSecond: Maybe<Scalars['Float']>;
  line: Maybe<Line>;
  location: Maybe<Location>;
  mode: Maybe<VehicleModeEnumeration>;
  monitored: Maybe<Scalars['Boolean']>;
  operator: Maybe<Operator>;
  serviceJourney: Maybe<ServiceJourney>;
  speed: Maybe<Scalars['Float']>;
  vehicleId: Maybe<Scalars['String']>;
  /** @deprecated Use 'vehicleId'. */
  vehicleRef: Maybe<Scalars['String']>;
};

export type RealtimePositionLineRefsQueryVariables = Exact<{ [key: string]: never; }>;


export type RealtimePositionLineRefsQuery = { __typename?: 'Query', vehicles: Array<{ __typename?: 'VehicleUpdate', line: { __typename?: 'Line', lineRef: string | null } | null } | null> | null };

export type RealtimeVehicleFragment = { __typename?: 'VehicleUpdate', vehicleRef: string | null, mode: VehicleModeEnumeration | null, lastUpdated: DateTime | null, lastUpdatedEpochSecond: number | null, line: { __typename?: 'Line', lineName: string | null, lineRef: string | null } | null, location: { __typename?: 'Location', latitude: number, longitude: number } | null };

export type RealtimeVehicleQueryVariables = Exact<{
  boundingBox?: InputMaybe<BoundingBox>;
}>;


export type RealtimeVehicleQuery = { __typename?: 'Query', vehicles: Array<{ __typename?: 'VehicleUpdate', vehicleRef: string | null, mode: VehicleModeEnumeration | null, lastUpdated: DateTime | null, lastUpdatedEpochSecond: number | null, line: { __typename?: 'Line', lineName: string | null, lineRef: string | null } | null, location: { __typename?: 'Location', latitude: number, longitude: number } | null } | null> | null };

export type RealtimeVehicleSubscriptionVariables = Exact<{
  bufferSize?: InputMaybe<Scalars['Int']>;
  bufferTime?: InputMaybe<Scalars['Int']>;
  boundingBox?: InputMaybe<BoundingBox>;
}>;


export type RealtimeVehicleSubscription = { __typename?: 'Subscription', vehicleUpdates: Array<{ __typename?: 'VehicleUpdate', vehicleRef: string | null, mode: VehicleModeEnumeration | null, lastUpdated: DateTime | null, lastUpdatedEpochSecond: number | null, line: { __typename?: 'Line', lineName: string | null, lineRef: string | null } | null, location: { __typename?: 'Location', latitude: number, longitude: number } | null } | null> | null };

export const RealtimeVehicleFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RealtimeVehicleFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VehicleUpdate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vehicleRef"}},{"kind":"Field","name":{"kind":"Name","value":"line"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lineName"}},{"kind":"Field","name":{"kind":"Name","value":"lineRef"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdated"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdatedEpochSecond"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]}}]} as unknown as DocumentNode;
export const RealtimePositionLineRefsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RealtimePositionLineRefs"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"vehicles"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vehicles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"line"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lineRef"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useRealtimePositionLineRefsQuery__
 *
 * To run a query within a React component, call `useRealtimePositionLineRefsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRealtimePositionLineRefsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRealtimePositionLineRefsQuery({
 *   variables: {
 *   },
 * });
 */
export function useRealtimePositionLineRefsQuery(baseOptions?: Apollo.QueryHookOptions<RealtimePositionLineRefsQuery, RealtimePositionLineRefsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RealtimePositionLineRefsQuery, RealtimePositionLineRefsQueryVariables>(RealtimePositionLineRefsDocument, options);
      }
export function useRealtimePositionLineRefsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RealtimePositionLineRefsQuery, RealtimePositionLineRefsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RealtimePositionLineRefsQuery, RealtimePositionLineRefsQueryVariables>(RealtimePositionLineRefsDocument, options);
        }
export type RealtimePositionLineRefsQueryHookResult = ReturnType<typeof useRealtimePositionLineRefsQuery>;
export type RealtimePositionLineRefsLazyQueryHookResult = ReturnType<typeof useRealtimePositionLineRefsLazyQuery>;
export type RealtimePositionLineRefsQueryResult = Apollo.QueryResult<RealtimePositionLineRefsQuery, RealtimePositionLineRefsQueryVariables>;
export const RealtimeVehicleQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RealtimeVehicleQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boundingBox"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BoundingBox"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"vehicles"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vehicles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boundingBox"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boundingBox"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RealtimeVehicleFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RealtimeVehicleFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VehicleUpdate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vehicleRef"}},{"kind":"Field","name":{"kind":"Name","value":"line"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lineName"}},{"kind":"Field","name":{"kind":"Name","value":"lineRef"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdated"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdatedEpochSecond"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useRealtimeVehicleQuery__
 *
 * To run a query within a React component, call `useRealtimeVehicleQuery` and pass it any options that fit your needs.
 * When your component renders, `useRealtimeVehicleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRealtimeVehicleQuery({
 *   variables: {
 *      boundingBox: // value for 'boundingBox'
 *   },
 * });
 */
export function useRealtimeVehicleQuery(baseOptions?: Apollo.QueryHookOptions<RealtimeVehicleQuery, RealtimeVehicleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RealtimeVehicleQuery, RealtimeVehicleQueryVariables>(RealtimeVehicleQueryDocument, options);
      }
export function useRealtimeVehicleQueryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RealtimeVehicleQuery, RealtimeVehicleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RealtimeVehicleQuery, RealtimeVehicleQueryVariables>(RealtimeVehicleQueryDocument, options);
        }
export type RealtimeVehicleQueryHookResult = ReturnType<typeof useRealtimeVehicleQuery>;
export type RealtimeVehicleQueryLazyQueryHookResult = ReturnType<typeof useRealtimeVehicleQueryLazyQuery>;
export type RealtimeVehicleQueryQueryResult = Apollo.QueryResult<RealtimeVehicleQuery, RealtimeVehicleQueryVariables>;
export const RealtimeVehicleSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"RealtimeVehicleSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bufferSize"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"bufferTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boundingBox"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BoundingBox"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"vehicles"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vehicleUpdates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"bufferSize"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bufferSize"}}},{"kind":"Argument","name":{"kind":"Name","value":"bufferTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"bufferTime"}}},{"kind":"Argument","name":{"kind":"Name","value":"boundingBox"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boundingBox"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RealtimeVehicleFragment"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RealtimeVehicleFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"VehicleUpdate"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"vehicleRef"}},{"kind":"Field","name":{"kind":"Name","value":"line"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lineName"}},{"kind":"Field","name":{"kind":"Name","value":"lineRef"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mode"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdated"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdatedEpochSecond"}},{"kind":"Field","name":{"kind":"Name","value":"location"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"latitude"}},{"kind":"Field","name":{"kind":"Name","value":"longitude"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useRealtimeVehicleSubscription__
 *
 * To run a query within a React component, call `useRealtimeVehicleSubscription` and pass it any options that fit your needs.
 * When your component renders, `useRealtimeVehicleSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRealtimeVehicleSubscription({
 *   variables: {
 *      bufferSize: // value for 'bufferSize'
 *      bufferTime: // value for 'bufferTime'
 *      boundingBox: // value for 'boundingBox'
 *   },
 * });
 */
export function useRealtimeVehicleSubscription(baseOptions?: Apollo.SubscriptionHookOptions<RealtimeVehicleSubscription, RealtimeVehicleSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<RealtimeVehicleSubscription, RealtimeVehicleSubscriptionVariables>(RealtimeVehicleSubscriptionDocument, options);
      }
export type RealtimeVehicleSubscriptionHookResult = ReturnType<typeof useRealtimeVehicleSubscription>;
export type RealtimeVehicleSubscriptionSubscriptionResult = Apollo.SubscriptionResult<RealtimeVehicleSubscription>;