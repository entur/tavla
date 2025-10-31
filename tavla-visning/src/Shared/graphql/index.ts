/* eslint-disable */
import type * as Types from "../types/graphql-schema";

import type { DocumentTypeDecoration } from "@graphql-typed-document-node/core";
export type TDepartureFragment = {
  __typename?: "EstimatedCall";
  aimedDepartureTime: DateTime;
  expectedDepartureTime: DateTime;
  expectedArrivalTime: DateTime;
  cancellation: boolean;
  realtime: boolean;
  quay: { __typename?: "Quay"; publicCode: string | null; name: string };
  destinationDisplay: {
    __typename?: "DestinationDisplay";
    frontText: string | null;
    via: Array<string | null> | null;
  } | null;
  serviceJourney: {
    __typename?: "ServiceJourney";
    id: string;
    transportMode: Types.TTransportMode | null;
    transportSubmode: Types.TTransportSubmode | null;
    line: {
      __typename?: "Line";
      id: string;
      publicCode: string | null;
      presentation: {
        __typename?: "Presentation";
        textColour: string | null;
        colour: string | null;
      } | null;
    };
  };
  situations: Array<{
    __typename?: "PtSituationElement";
    id: string;
    description: Array<{
      __typename?: "MultilingualString";
      value: string;
      language: string | null;
    }>;
    summary: Array<{
      __typename?: "MultilingualString";
      value: string;
      language: string | null;
    }>;
  }>;
};

export type TLinesFragment = {
  __typename?: "Quay";
  lines: Array<{
    __typename?: "Line";
    id: string;
    publicCode: string | null;
    name: string | null;
    transportMode: Types.TTransportMode | null;
  }>;
};

export type TSituationFragment = {
  origin?: string;
  __typename?: "PtSituationElement";
  id: string;
  description: Array<{
    __typename?: "MultilingualString";
    value: string;
    language: string | null;
  }>;
  summary: Array<{
    __typename?: "MultilingualString";
    value: string;
    language: string | null;
  }>;
};

export type TGetQuayQueryVariables = Types.Exact<{
  quayId: Types.Scalars["String"]["input"];
  whitelistedTransportModes?: Types.InputMaybe<
    | Array<Types.InputMaybe<Types.TTransportMode>>
    | Types.InputMaybe<Types.TTransportMode>
  >;
  whitelistedLines?: Types.InputMaybe<
    Array<Types.Scalars["ID"]["input"]> | Types.Scalars["ID"]["input"]
  >;
  numberOfDepartures?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  startTime?: Types.InputMaybe<Types.Scalars["DateTime"]["input"]>;
}>;

export type TGetQuayQuery = {
  __typename?: "QueryType";
  quay: {
    __typename?: "Quay";
    name: string;
    description: string | null;
    publicCode: string | null;
    estimatedCalls: Array<{
      __typename?: "EstimatedCall";
      aimedDepartureTime: DateTime;
      expectedDepartureTime: DateTime;
      expectedArrivalTime: DateTime;
      cancellation: boolean;
      realtime: boolean;
      quay: {
        __typename?: "Quay";
        publicCode: string | null;
        name: string;
      };
      destinationDisplay: {
        __typename?: "DestinationDisplay";
        frontText: string | null;
        via: Array<string | null> | null;
      } | null;
      serviceJourney: {
        __typename?: "ServiceJourney";
        id: string;
        transportMode: Types.TTransportMode | null;
        transportSubmode: Types.TTransportSubmode | null;
        line: {
          __typename?: "Line";
          id: string;
          publicCode: string | null;
          presentation: {
            __typename?: "Presentation";
            textColour: string | null;
            colour: string | null;
          } | null;
        };
      };
      situations: Array<{
        __typename?: "PtSituationElement";
        id: string;
        description: Array<{
          __typename?: "MultilingualString";
          value: string;
          language: string | null;
        }>;
        summary: Array<{
          __typename?: "MultilingualString";
          value: string;
          language: string | null;
        }>;
      }>;
    }>;
    situations: Array<{
      __typename?: "PtSituationElement";
      id: string;
      description: Array<{
        __typename?: "MultilingualString";
        value: string;
        language: string | null;
      }>;
      summary: Array<{
        __typename?: "MultilingualString";
        value: string;
        language: string | null;
      }>;
    }>;
    stopPlace: {
      situations: Array<{
        __typename?: "PtSituationElement";
        id: string;
        description: Array<{
          __typename?: "MultilingualString";
          value: string;
          language: string | null;
        }>;
        summary: Array<{
          __typename?: "MultilingualString";
          value: string;
          language: string | null;
        }>;
      }>;
    };
    lines: Array<{
      __typename?: "Line";
      id: string;
      publicCode: string | null;
      name: string | null;
      transportMode: Types.TTransportMode | null;
    }>;
  } | null;
};

export type TQuayCoordinatesQueryVariables = Types.Exact<{
  id: Types.Scalars["String"]["input"];
}>;

export type TQuayCoordinatesQuery = {
  __typename?: "QueryType";
  quay: {
    __typename?: "Quay";
    id: string;
    longitude: number | null;
    latitude: number | null;
  } | null;
};

export type TQuayEditQueryVariables = Types.Exact<{
  placeId: Types.Scalars["String"]["input"];
}>;

export type TQuayEditQuery = {
  __typename?: "QueryType";
  quay: {
    __typename?: "Quay";
    lines: Array<{
      __typename?: "Line";
      id: string;
      publicCode: string | null;
      name: string | null;
      transportMode: Types.TTransportMode | null;
    }>;
  } | null;
};

export type TQuayNameQueryVariables = Types.Exact<{
  id: Types.Scalars["String"]["input"];
}>;

export type TQuayNameQuery = {
  __typename?: "QueryType";
  quay: {
    __typename?: "Quay";
    name: string;
    description: string | null;
    publicCode: string | null;
    id: string;
  } | null;
};

export type TQuaysSearchQueryVariables = Types.Exact<{
  stopPlaceId: Types.Scalars["String"]["input"];
}>;

export type TQuaysSearchQuery = {
  __typename?: "QueryType";
  stopPlace: {
    __typename?: "StopPlace";
    quays: Array<{
      __typename?: "Quay";
      id: string;
      publicCode: string | null;
      description: string | null;
      stopPlace: {
        __typename?: "StopPlace";
        transportMode: Array<Types.TTransportMode | null> | null;
      } | null;
      lines: Array<{
        __typename?: "Line";
        id: string;
        publicCode: string | null;
        name: string | null;
        transportMode: Types.TTransportMode | null;
      }>;
    } | null> | null;
  } | null;
};

export type TStopPlaceQueryVariables = Types.Exact<{
  stopPlaceId: Types.Scalars["String"]["input"];
  whitelistedTransportModes?: Types.InputMaybe<
    | Array<Types.InputMaybe<Types.TTransportMode>>
    | Types.InputMaybe<Types.TTransportMode>
  >;
  whitelistedLines?: Types.InputMaybe<
    Array<Types.Scalars["ID"]["input"]> | Types.Scalars["ID"]["input"]
  >;
  numberOfDepartures?: Types.InputMaybe<Types.Scalars["Int"]["input"]>;
  startTime?: Types.InputMaybe<Types.Scalars["DateTime"]["input"]>;
}>;

export type TStopPlaceQuery = {
  __typename?: "QueryType";
  stopPlace: {
    __typename?: "StopPlace";
    name: string;
    transportMode: Array<Types.TTransportMode | null> | null;
    estimatedCalls: Array<{
      __typename?: "EstimatedCall";
      aimedDepartureTime: DateTime;
      expectedDepartureTime: DateTime;
      expectedArrivalTime: DateTime;
      cancellation: boolean;
      realtime: boolean;
      quay: {
        __typename?: "Quay";
        publicCode: string | null;
        name: string;
      };
      destinationDisplay: {
        __typename?: "DestinationDisplay";
        frontText: string | null;
        via: Array<string | null> | null;
      } | null;
      serviceJourney: {
        __typename?: "ServiceJourney";
        id: string;
        transportMode: Types.TTransportMode | null;
        transportSubmode: Types.TTransportSubmode | null;
        line: {
          __typename?: "Line";
          id: string;
          publicCode: string | null;
          presentation: {
            __typename?: "Presentation";
            textColour: string | null;
            colour: string | null;
          } | null;
        };
      };
      situations: Array<{
        __typename?: "PtSituationElement";
        id: string;
        description: Array<{
          __typename?: "MultilingualString";
          value: string;
          language: string | null;
        }>;
        summary: Array<{
          __typename?: "MultilingualString";
          value: string;
          language: string | null;
        }>;
      }>;
    }>;
    situations: Array<{
      __typename?: "PtSituationElement";
      id: string;
      description: Array<{
        __typename?: "MultilingualString";
        value: string;
        language: string | null;
      }>;
      summary: Array<{
        __typename?: "MultilingualString";
        value: string;
        language: string | null;
      }>;
    }>;
  } | null;
};

export type TStopPlaceCoordinatesQueryVariables = Types.Exact<{
  id: Types.Scalars["String"]["input"];
}>;

export type TStopPlaceCoordinatesQuery = {
  __typename?: "QueryType";
  stopPlace: {
    __typename?: "StopPlace";
    id: string;
    longitude: number | null;
    latitude: number | null;
  } | null;
};

export type TStopPlaceEditQueryVariables = Types.Exact<{
  placeId: Types.Scalars["String"]["input"];
}>;

export type TStopPlaceEditQuery = {
  __typename?: "QueryType";
  stopPlace: {
    __typename?: "StopPlace";
    name: string;
    quays: Array<{
      __typename?: "Quay";
      lines: Array<{
        __typename?: "Line";
        id: string;
        publicCode: string | null;
        name: string | null;
        transportMode: Types.TTransportMode | null;
      }>;
    } | null> | null;
  } | null;
};

export type TStopPlaceNameQueryVariables = Types.Exact<{
  id: Types.Scalars["String"]["input"];
}>;

export type TStopPlaceNameQuery = {
  __typename?: "QueryType";
  stopPlace: { __typename?: "StopPlace"; name: string; id: string } | null;
};

export type TWalkDistanceQueryVariables = Types.Exact<{
  from: Types.TInputCoordinates;
  to: Types.TInputCoordinates;
}>;

export type TWalkDistanceQuery = {
  __typename?: "QueryType";
  trip: {
    __typename?: "Trip";
    tripPatterns: Array<{
      __typename?: "TripPattern";
      duration: Long | null;
      streetDistance: number | null;
      legs: Array<{
        __typename?: "Leg";
        expectedStartTime: DateTime;
        expectedEndTime: DateTime;
        mode: Types.TMode;
        distance: number;
        line: {
          __typename?: "Line";
          id: string;
          publicCode: string | null;
        } | null;
      }>;
    }>;
  };
};

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: DocumentTypeDecoration<TResult, TVariables>["__apiType"];

  value: string;
  __meta__?: Record<string, any>;

  constructor(value: string, __meta__?: Record<string, any>) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const SituationFragment = new TypedDocumentString(
  `fragment situation on PtSituationElement {
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
  { fragmentName: "situation" }
) as unknown as TypedDocumentString<TSituationFragment, unknown>;
export const DepartureFragment = new TypedDocumentString(
  `fragment departure on EstimatedCall {
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
  { fragmentName: "departure" }
) as unknown as TypedDocumentString<TDepartureFragment, unknown>;
export const LinesFragment = new TypedDocumentString(
  `
    fragment lines on Quay {
  lines {
    id
    publicCode
    name
    transportMode
  }
}`,
  { fragmentName: "lines" }
) as unknown as TypedDocumentString<TLinesFragment, unknown>;
export const GetQuayQuery = new TypedDocumentString(`
query getQuay($quayId: String!, $whitelistedTransportModes: [TransportMode], $whitelistedLines: [ID!], $numberOfDepartures: Int = 20, $startTime: DateTime) {
  quay(
    id: $quayId
  ) {
    name
    description
    publicCode
    ...lines
    estimatedCalls(
      numberOfDepartures: $numberOfDepartures,
      whiteListedModes: $whitelistedTransportModes,
      whiteListed: {
        lines: $whitelistedLines
      },
      includeCancelledTrips: true,
      startTime: $startTime
    ) {
      ...departure
    }
    situations {
      ...situation
    }
    stopPlace {
      situations {
        ...situation
      }
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
}`) as unknown as TypedDocumentString<TGetQuayQuery, TGetQuayQueryVariables>;
export const QuayCoordinatesQuery = new TypedDocumentString(`
query quayCoordinates($id: String!) {
  quay(
    id: $id
  ) {
    id
    longitude
    latitude
  }
}`) as unknown as TypedDocumentString<
  TQuayCoordinatesQuery,
  TQuayCoordinatesQueryVariables
>;
export const QuayEditQuery = new TypedDocumentString(`
query quayEdit($placeId: String!) {
  quay(
    id: $placeId
  ) {
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
}`) as unknown as TypedDocumentString<TQuayEditQuery, TQuayEditQueryVariables>;
export const QuayNameQuery = new TypedDocumentString(`
query QuayName($id: String!) {
  quay(
    id: $id
  ) {
    name
    description
    publicCode
    id
  }
}`) as unknown as TypedDocumentString<TQuayNameQuery, TQuayNameQueryVariables>;
export const QuaysSearchQuery = new TypedDocumentString(`
query quaysSearch($stopPlaceId: String!) {
  stopPlace(
    id: $stopPlaceId
  ) {
    quays(
      filterByInUse: true
    ) {
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
  TQuaysSearchQuery,
  TQuaysSearchQueryVariables
>;
export const StopPlaceQuery = new TypedDocumentString(`
query StopPlace($stopPlaceId: String!, $whitelistedTransportModes: [TransportMode], $whitelistedLines: [ID!], $numberOfDepartures: Int = 20, $startTime: DateTime) {
  stopPlace(
    id: $stopPlaceId
  ) {
    name
    transportMode
    estimatedCalls(
      numberOfDepartures: $numberOfDepartures,
      whiteListedModes: $whitelistedTransportModes,
      whiteListed: {
        lines: $whitelistedLines
      },
      includeCancelledTrips: true,
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
  TStopPlaceQuery,
  TStopPlaceQueryVariables
>;
export const StopPlaceCoordinatesQuery = new TypedDocumentString(`
query stopPlaceCoordinates($id: String!) {
  stopPlace(
    id: $id
  ) {
    id
    longitude
    latitude
  }
}`) as unknown as TypedDocumentString<
  TStopPlaceCoordinatesQuery,
  TStopPlaceCoordinatesQueryVariables
>;
export const StopPlaceEditQuery = new TypedDocumentString(`
query stopPlaceEdit($placeId: String!) {
  stopPlace(
    id: $placeId
  ) {
    name
    quays(
      filterByInUse: true
    ) {
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
  TStopPlaceEditQuery,
  TStopPlaceEditQueryVariables
>;
export const StopPlaceNameQuery = new TypedDocumentString(`
query StopPlaceName($id: String!) {
  stopPlace(
    id: $id
  ) {
    name
    id
  }
}`) as unknown as TypedDocumentString<
  TStopPlaceNameQuery,
  TStopPlaceNameQueryVariables
>;
export const WalkDistanceQuery = new TypedDocumentString(`
query walkDistance($from: InputCoordinates!, $to: InputCoordinates!) {
  trip(
    from: {
      coordinates: $from
    },
    to: {
      coordinates: $to
    },
    modes: {
      directMode: foot
      transportModes: []
    }
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
}`) as unknown as TypedDocumentString<
  TWalkDistanceQuery,
  TWalkDistanceQueryVariables
>;
