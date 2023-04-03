import { createQuery, gql } from "../utils";
import { departureFragment } from "../fragments/departure";
import { TQuayData } from "@/types/graphql";

const quayQuery = createQuery<TQuayData, { quayId: string }>(
  gql`
    ${departureFragment}
    query getQuay($quayId: String!) {
      quay(id: $quayId) {
        name
        description
        publicCode
        estimatedCalls(numberOfDepartures: 20) {
          ...departure
        }
      }
    }
  `
);

export { quayQuery };
