import { TLinesFragment } from 'graphql/index'
import { uniqBy } from 'lodash'
import { TTransportMode } from 'types/graphql-schema'
import { sortLineByPublicCode } from '../utils'
import { useCallback } from 'react'
import { TLineFragment } from '../types'

function useToggledLines(lines: TLinesFragment['lines']) {
    const allTransportModes: TTransportMode[] = uniqBy(
        lines,
        'transportMode',
    ).map((line) => line.transportMode ?? 'unknown')

    const uniqLines = uniqBy(lines, 'id')

    const linesByModeSorted = allTransportModes.map((transportMode) => ({
        transportMode,
        lines: uniqLines
            .filter((line) => line.transportMode === transportMode)
            .sort(sortLineByPublicCode),
    }))

    const toggleAllLinesForMode = useCallback(
        (transportMode: TTransportMode) => null,
        [],
    )
    const toggleLine = useCallback((line: TLineFragment) => null, [])

    return { linesByMode: linesByModeSorted, toggleAllLinesForMode, toggleLine }
}

export { useToggledLines }
