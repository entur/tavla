import { createQuery, gql } from "../utils";
import { departureFragment } from "../fragments/departure";
import { TStopPlaceData } from "@/types/graphql";

const stopPlaceQuery = createQuery<TStopPlaceData, { stopPlaceId: string }>(
  gql`
    ${departureFragment}
    query stopPlaceName($stopPlaceId: String!) {
      stopPlace(id: $stopPlaceId) {
        name
        estimatedCalls(numberOfDepartures: 20) {
          ...departure
        }
      }
    }
  `
);

export { stopPlaceQuery };
