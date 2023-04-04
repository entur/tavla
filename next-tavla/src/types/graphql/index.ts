import * as Types from './schema';

export type TDeparture = { __typename?: 'EstimatedCall', aimedDepartureTime: DateTime, expectedDepartureTime: DateTime, cancellation: boolean, destinationDisplay: { __typename?: 'DestinationDisplay', frontText: string | null } | null, serviceJourney: { __typename?: 'ServiceJourney', id: string, transportMode: Types.TTransportMode | null, transportSubmode: Types.TTransportSubmode | null, line: { __typename?: 'Line', publicCode: string | null, authority: { __typename?: 'Authority', name: string } | null, presentation: { __typename?: 'Presentation', textColour: string | null, colour: string | null } | null } }, situations: Array<{ __typename?: 'PtSituationElement', id: string, description: Array<{ __typename?: 'MultilingualString', value: string, language: string | null }>, summary: Array<{ __typename?: 'MultilingualString', value: string, language: string | null }> }> };

export type TSituation = { __typename?: 'PtSituationElement', id: string, description: Array<{ __typename?: 'MultilingualString', value: string, language: string | null }>, summary: Array<{ __typename?: 'MultilingualString', value: string, language: string | null }> };

export type TGetQuayVariables = Types.Exact<{
  quayId: Types.Scalars['String'];
}>;


export type TGetQuay = { __typename?: 'QueryType', quay: { __typename?: 'Quay', name: string, description: string | null, publicCode: string | null, estimatedCalls: Array<{ __typename?: 'EstimatedCall', aimedDepartureTime: DateTime, expectedDepartureTime: DateTime, cancellation: boolean, destinationDisplay: { __typename?: 'DestinationDisplay', frontText: string | null } | null, serviceJourney: { __typename?: 'ServiceJourney', id: string, transportMode: Types.TTransportMode | null, transportSubmode: Types.TTransportSubmode | null, line: { __typename?: 'Line', publicCode: string | null, authority: { __typename?: 'Authority', name: string } | null, presentation: { __typename?: 'Presentation', textColour: string | null, colour: string | null } | null } }, situations: Array<{ __typename?: 'PtSituationElement', id: string, description: Array<{ __typename?: 'MultilingualString', value: string, language: string | null }>, summary: Array<{ __typename?: 'MultilingualString', value: string, language: string | null }> }> }> } | null };

export type TGetStopPlaceVariables = Types.Exact<{
  stopPlaceId: Types.Scalars['String'];
}>;


export type TGetStopPlace = { __typename?: 'QueryType', stopPlace: { __typename?: 'StopPlace', name: string, estimatedCalls: Array<{ __typename?: 'EstimatedCall', aimedDepartureTime: DateTime, expectedDepartureTime: DateTime, cancellation: boolean, destinationDisplay: { __typename?: 'DestinationDisplay', frontText: string | null } | null, serviceJourney: { __typename?: 'ServiceJourney', id: string, transportMode: Types.TTransportMode | null, transportSubmode: Types.TTransportSubmode | null, line: { __typename?: 'Line', publicCode: string | null, authority: { __typename?: 'Authority', name: string } | null, presentation: { __typename?: 'Presentation', textColour: string | null, colour: string | null } | null } }, situations: Array<{ __typename?: 'PtSituationElement', id: string, description: Array<{ __typename?: 'MultilingualString', value: string, language: string | null }>, summary: Array<{ __typename?: 'MultilingualString', value: string, language: string | null }> }> }> } | null };
