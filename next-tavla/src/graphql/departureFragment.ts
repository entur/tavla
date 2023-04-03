import { gql } from "./utils";

const departureFragment = gql`
  fragment departure on EstimatedCall {
    destinationDisplay {
      frontText
    }
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
  }
`;

export { departureFragment };
