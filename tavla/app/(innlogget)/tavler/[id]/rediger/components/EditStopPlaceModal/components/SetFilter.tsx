import { Heading5 } from '@entur/typography'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'

import { useNonNullContext } from 'src/hooks/useNonNullContext'
import type { TTransportMode } from 'src/types/graphql-schema'
import type { QuayWithFrontText } from '../../utils/types'
import { TileContext } from '../context'
import { generateQuayLineKey, transportModeNames } from '../utils'
import { PlatformAndLines } from './PlatformAndLines'
import { SetFilterMode } from './SetFilterMode'

export type FilterMode = 'stopPlaceFilter' | 'quaysFilter'

export function SetFilter({
    quays,
    checkedLineIds,
    onCheckedLineIdsChange,
    trackingLocation,
    onFieldChanged,
}: {
    quays: QuayWithFrontText[]
    checkedLineIds: Set<string>
    onCheckedLineIdsChange: (checkedLineIds: Set<string>) => void
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    onFieldChanged: (field: string) => void
}) {
    const [filterMode, setFilterMode] = useState<FilterMode>('stopPlaceFilter')
    const { capture } = usePosthogTracking()
    const tile = useNonNullContext(TileContext)

    return (
        <div className="flex flex-col gap-4">
            <Heading5 as="h2">
                Hvilke plattformer og linjer vil du vise på Tavla?
            </Heading5>
            <SetFilterMode
                trackingLocation={trackingLocation}
                selectedFilterMode={filterMode}
                onFieldChanged={(mode) => setFilterMode(mode)}
            />
            {filterMode === 'quaysFilter' && <div>Platform</div>}
            {filterMode === 'stopPlaceFilter' && <div>Stop Place</div>}
        </div>
    )
}
