import { createQuery, gql } from "../utils";
import { departureFragment } from "../fragments/departure";
import { TGetStopPlace, TGetStopPlaceVariables } from "@/types/graphql";

const stopPlaceQuery = createQuery<TGetStopPlace, TGetStopPlaceVariables>(
  gql`
    ${departureFragment}
    query getStopPlace(
      $stopPlaceId: String!
      $whitelistedTransportModes: [TransportMode]
      $whitelistedLines: [ID!]
    ) {
      stopPlace(id: $stopPlaceId) {
        name
        estimatedCalls(
          numberOfDepartures: 20
          whiteListedModes: $whitelistedTransportModes
          whiteListed: { lines: $whitelistedLines }
        ) {
          ...departure
        }
      }
    }
  `
);

export { stopPlaceQuery };
