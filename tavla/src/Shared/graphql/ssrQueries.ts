// Queries used when server side rendering
// Used for boards on unsupported browsers
import {
    TypedDocumentString,
    TStopPlaceQuery,
    TStopPlaceQueryVariables,
    TGetQuayQuery,
    TGetQuayQueryVariables,
} from '.'

export const SSRStopPlaceQuery = `
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
    }` as unknown as TypedDocumentString<
    TStopPlaceQuery,
    TStopPlaceQueryVariables
>

export const SSRQuayQuery = `
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
}` as unknown as TypedDocumentString<TGetQuayQuery, TGetQuayQueryVariables>
