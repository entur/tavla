import { gql } from "../utils";

const situationFragment = gql`
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
`;

export { situationFragment };
