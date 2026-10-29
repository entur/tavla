import { Heading5, Paragraph } from '@entur/typography'
import type { EventProps } from 'app/posthog/events'
import { useState } from 'react'
import type { QuaysFilterDB } from 'types/db-types/boards'
import type { QuayWithFrontText } from '../../utils/types'
import { QuaysFilterView } from './QuaysFilterView'
import { SetFilterMode } from './SetFilterMode'

export type FilterMode = 'stopPlaceFilter' | 'quaysFilter'

export function SetFilter({
    quays,
    trackingLocation,
    onFieldChanged,
}: {
    quays: QuayWithFrontText[]
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    onFieldChanged: (field: string) => void
}) {
    const [filterMode, setFilterMode] = useState<FilterMode>('stopPlaceFilter')
    const [quaysFilter, setQuaysFilter] = useState<QuaysFilterDB>({
        type: 'quaysFilter',
        quays: [],
    })

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
                    quaysFilter={quaysFilter}
                    setQuaysFilter={setQuaysFilter}
                    trackingLocation={trackingLocation}
                    onFieldChanged={onFieldChanged}
                />
            )}
            {filterMode === 'stopPlaceFilter' && <div>Stop Place</div>}
        </div>
    )
}
