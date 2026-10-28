import { Heading5, Paragraph } from '@entur/typography'
import type { EventProps } from 'app/posthog/events'
import { useState } from 'react'
import type { QuayWithFrontText } from '../../utils/types'
import { QuaysFilterView } from './QuaysFilterView'
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

    if (quays.length === 0)
        return (
            <Paragraph className="italic">
                Det er ingen avganger fra dette stoppestedet de neste syv
                dagene.
            </Paragraph>
        )

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

            {filterMode === 'quaysFilter' && (
                <QuaysFilterView
                    quays={quays}
                    checkedLineIds={checkedLineIds}
                    onCheckedLineIdsChange={onCheckedLineIdsChange}
                    trackingLocation={trackingLocation}
                    onFieldChanged={onFieldChanged}
                />
            )}
            {filterMode === 'stopPlaceFilter' && <div>Stop Place</div>}
        </div>
    )
}
