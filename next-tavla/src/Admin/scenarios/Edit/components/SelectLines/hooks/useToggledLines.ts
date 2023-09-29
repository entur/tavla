import { TLinesFragment } from 'graphql/index'
import { uniqBy } from 'lodash'
import { sortLineByPublicCode } from '../utils'

function useToggledLines(lines: TLinesFragment['lines']) {
    const transportModes = uniqBy(lines, 'transportMode').map(
        (line) => line.transportMode,
    )

    const uniqLines = uniqBy(lines, 'id').sort(sortLineByPublicCode)

    const allLinesByTransportMode = transportModes.map((transportMode) => ({
        transportMode,
        lines: uniqLines.filter((line) => line.transportMode === transportMode),
    }))
    return null
}

export { useToggledLines }
