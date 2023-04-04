import { gql } from "../utils";
import { situationFragment } from "./situation";

const departureFragment = gql`
  ${situationFragment}
  fragment departure on EstimatedCall {
    destinationDisplay {
      frontText
    }
    aimedDepartureTime
    expectedDepartureTime
    serviceJourney {
      id
      transportMode
      transportSubmode
      line {
        publicCode
        authority {
          name
        }
        presentation {
          textColour
          colour
        }
      }
    }
    cancellation
    situations {
      ...situation
    }
  }
`;

export { departureFragment };
