import { gql } from '../utils'

const linesFragment = gql`
    fragment lines on Quay {
        lines {
            id
            publicCode
            name
        }
    }
`

export { linesFragment }
