import { createQuery, gql } from "./utils";
import { departureFragment } from "./departureFragment";
import { TStopPlaceData } from "@/types/stopPlace";

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
