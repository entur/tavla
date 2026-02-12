/* eslint-disable */
import type * as Types from 'types/graphql-schema'

import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core'
export class TypedDocumentString<TResult, TVariables>
    extends String
    implements DocumentTypeDecoration<TResult, TVariables>
{
    __apiType?: NonNullable<
        DocumentTypeDecoration<TResult, TVariables>['__apiType']
    >
    private value: string
    public __meta__?: Record<string, any> | undefined

    constructor(value: string, __meta__?: Record<string, any> | undefined) {
        super(value)
        this.value = value
        this.__meta__ = __meta__
    }

    override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
        return this.value
    }
}
export const SituationFragment = new TypedDocumentString(
    `
    fragment situation on PtSituationElement {
  id
  description {
    value
    language
  }
  summary {
    value
    language
  }
}
    `,
    { fragmentName: 'situation' },
) as unknown as TypedDocumentString<Types.TSituationFragment, unknown>
export const DepartureFragment = new TypedDocumentString(
    `
    fragment departure on EstimatedCall {
  quay {
    publicCode
    name
  }
  destinationDisplay {
    frontText
    via
  }
  aimedDepartureTime
  expectedDepartureTime
  expectedArrivalTime
  serviceJourney {
    id
    transportMode
    transportSubmode
    line {
      id
      publicCode
      presentation {
        textColour
        colour
      }
    }
  }
  cancellation
  realtime
  situations {
    ...situation
  }
}
    fragment situation on PtSituationElement {
  id
  description {
    value
    language
  }
  summary {
    value
    language
  }
}`,
    { fragmentName: 'departure' },
) as unknown as TypedDocumentString<Types.TDepartureFragment, unknown>
export const LinesFragment = new TypedDocumentString(
    `
    fragment lines on Quay {
  lines {
    id
    publicCode
    name
    transportMode
  }
}
    `,
    { fragmentName: 'lines' },
) as unknown as TypedDocumentString<Types.TLinesFragment, unknown>
export const GetQuayQuery = new TypedDocumentString(`
    query getQuay($quayId: String!, $whitelistedTransportModes: [TransportMode], $whitelistedLines: [ID!], $numberOfDepartures: Int = 20, $startTime: DateTime) {
  quay(id: $quayId) {
    name
    description
    publicCode
    ...lines
    estimatedCalls(
      numberOfDepartures: $numberOfDepartures
      whiteListedModes: $whitelistedTransportModes
      whiteListed: {lines: $whitelistedLines}
      includeCancelledTrips: true
      startTime: $startTime
    ) {
      ...departure
    }
    situations {
      ...situation
    }
  }
}
    fragment departure on EstimatedCall {
  quay {
    publicCode
    name
  }
  destinationDisplay {
    frontText
    via
  }
  aimedDepartureTime
  expectedDepartureTime
  expectedArrivalTime
  serviceJourney {
    id
    transportMode
    transportSubmode
    line {
      id
      publicCode
      presentation {
        textColour
        colour
      }
    }
  }
  cancellation
  realtime
  situations {
    ...situation
  }
}
fragment lines on Quay {
  lines {
    id
    publicCode
    name
    transportMode
  }
}
fragment situation on PtSituationElement {
  id
  description {
    value
    language
  }
  summary {
    value
    language
  }
}`) as unknown as TypedDocumentString<
    Types.TGetQuayQuery,
    Types.TGetQuayQueryVariables
>
export const QuayCoordinatesQuery = new TypedDocumentString(`
    query quayCoordinates($id: String!) {
  quay(id: $id) {
    id
    longitude
    latitude
  }
}
    `) as unknown as TypedDocumentString<
    Types.TQuayCoordinatesQuery,
    Types.TQuayCoordinatesQueryVariables
>
export const QuayEditQuery = new TypedDocumentString(`
    query quayEdit($placeId: String!) {
  quay(id: $placeId) {
    ...lines
  }
}
    fragment lines on Quay {
  lines {
    id
    publicCode
    name
    transportMode
  }
}`) as unknown as TypedDocumentString<
    Types.TQuayEditQuery,
    Types.TQuayEditQueryVariables
>
export const QuayNameQuery = new TypedDocumentString(`
    query QuayName($id: String!) {
  quay(id: $id) {
    name
    description
    publicCode
    id
  }
}
    `) as unknown as TypedDocumentString<
    Types.TQuayNameQuery,
    Types.TQuayNameQueryVariables
>
export const QuaysSearchQuery = new TypedDocumentString(`
    query quaysSearch($stopPlaceId: String!) {
  stopPlace(id: $stopPlaceId) {
    quays(filterByInUse: true) {
      id
      publicCode
      description
      stopPlace {
        transportMode
      }
      ...lines
    }
  }
}
    fragment lines on Quay {
  lines {
    id
    publicCode
    name
    transportMode
  }
}`) as unknown as TypedDocumentString<
    Types.TQuaysSearchQuery,
    Types.TQuaysSearchQueryVariables
>
export const StopPlaceQuery = new TypedDocumentString(`
    query StopPlace($stopPlaceId: String!, $whitelistedTransportModes: [TransportMode], $whitelistedLines: [ID!], $numberOfDepartures: Int = 20, $startTime: DateTime) {
  stopPlace(id: $stopPlaceId) {
    name
    transportMode
    estimatedCalls(
      numberOfDepartures: $numberOfDepartures
      whiteListedModes: $whitelistedTransportModes
      whiteListed: {lines: $whitelistedLines}
      includeCancelledTrips: true
      startTime: $startTime
    ) {
      ...departure
    }
    situations {
      ...situation
    }
  }
}
    fragment departure on EstimatedCall {
  quay {
    publicCode
    name
  }
  destinationDisplay {
    frontText
    via
  }
  aimedDepartureTime
  expectedDepartureTime
  expectedArrivalTime
  serviceJourney {
    id
    transportMode
    transportSubmode
    line {
      id
      publicCode
      presentation {
        textColour
        colour
      }
    }
  }
  cancellation
  realtime
  situations {
    ...situation
  }
}
fragment situation on PtSituationElement {
  id
  description {
    value
    language
  }
  summary {
    value
    language
  }
}`) as unknown as TypedDocumentString<
    Types.TStopPlaceQuery,
    Types.TStopPlaceQueryVariables
>
export const StopPlaceCoordinatesQuery = new TypedDocumentString(`
    query stopPlaceCoordinates($id: String!) {
  stopPlace(id: $id) {
    id
    longitude
    latitude
  }
}
    `) as unknown as TypedDocumentString<
    Types.TStopPlaceCoordinatesQuery,
    Types.TStopPlaceCoordinatesQueryVariables
>
export const StopPlaceEditQuery = new TypedDocumentString(`
    query stopPlaceEdit($placeId: String!) {
  stopPlace(id: $placeId) {
    name
    quays(filterByInUse: true) {
      ...lines
    }
  }
}
    fragment lines on Quay {
  lines {
    id
    publicCode
    name
    transportMode
  }
}`) as unknown as TypedDocumentString<
    Types.TStopPlaceEditQuery,
    Types.TStopPlaceEditQueryVariables
>
export const StopPlaceNameQuery = new TypedDocumentString(`
    query StopPlaceName($id: String!) {
  stopPlace(id: $id) {
    name
    id
  }
}
    `) as unknown as TypedDocumentString<
    Types.TStopPlaceNameQuery,
    Types.TStopPlaceNameQueryVariables
>
export const WalkDistanceQuery = new TypedDocumentString(`
    query walkDistance($from: InputCoordinates!, $to: InputCoordinates!) {
  trip(
    from: {coordinates: $from}
    to: {coordinates: $to}
    modes: {directMode: foot, transportModes: []}
  ) {
    tripPatterns {
      duration
      streetDistance
      legs {
        expectedStartTime
        expectedEndTime
        mode
        distance
        line {
          id
          publicCode
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<
    Types.TWalkDistanceQuery,
    Types.TWalkDistanceQueryVariables
>
