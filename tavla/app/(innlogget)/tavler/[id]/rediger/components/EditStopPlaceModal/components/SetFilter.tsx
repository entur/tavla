import { Heading5, Paragraph } from '@entur/typography'
import type { EventProps } from 'app/posthog/events'
import type { QuaysFilterDB } from 'types/db-types/boards'
import type { QuayWithFrontText } from '../../utils/types'
import { QuaysFilterView } from './QuaysFilterView'
import { SetFilterMode } from './SetFilterMode'

export type FilterMode = 'stopPlaceFilter' | 'quaysFilter'

export function SetFilter({
    quays,
    filterType,
    setFilterType,
    quaysFilter,
    setQuaysFilter,
    trackingLocation,
    onFieldChanged,
}: {
    quays: QuayWithFrontText[]
    filterType: FilterMode
    setFilterType: (mode: FilterMode) => void
    quaysFilter: QuaysFilterDB
    setQuaysFilter: (filter: QuaysFilterDB) => void
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    onFieldChanged: (field: string) => void
}) {
    if (quays.length === 0)
        return (
            <Paragraph className="italic">
                Det er ingen avganger fra dette stoppestedet de neste syv
                dagene.
            </Paragraph>
        )

    const handleModeChange = (mode: FilterMode) => {
        setFilterType(mode)
        onFieldChanged('transport_mode_filter')
    }

    return (
        <div className="flex flex-col gap-4">
            <Heading5 as="h2">
                Hvilke plattformer og linjer vil du vise på Tavla?
            </Heading5>
            <SetFilterMode
                trackingLocation={trackingLocation}
                selectedFilterMode={filterType}
                handleFilterModeChange={handleModeChange}
            />

            {filterType === 'quaysFilter' && (
                <QuaysFilterView
                    quays={quays}
                    quaysFilter={quaysFilter}
                    setQuaysFilter={setQuaysFilter}
                    trackingLocation={trackingLocation}
                    onFieldChanged={onFieldChanged}
                />
            )}
            {filterType === 'stopPlaceFilter' && <div>Stop Place</div>}
        </div>
    )
}
