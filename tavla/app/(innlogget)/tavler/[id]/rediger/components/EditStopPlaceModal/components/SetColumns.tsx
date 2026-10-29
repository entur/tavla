import { FilterChip } from '@entur/chip'
import { Heading5, SubParagraph } from '@entur/typography'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'
import { type TileColumnDB, TileColumns } from 'src/types/db-types/boards'
import { typedEntries } from 'src/utils/typeguards'
import { ColumnModal } from './ColumnModal'

const COLUMN_TRACKING_VALUE: Record<
    keyof typeof TileColumns,
    EventProps<'stop_place_edit_interaction'>['column_value']
> = {
    aimedTime: 'eta',
    arrivalTime: 'arrival',
    line: 'line',
    fromStopPlace: 'fromStopPlace',
    destination: 'destination',
    name: 'stop_place',
    platform: 'platform',
    time: 'expected',
}

export function SetColumns({
    columns,
    onColumnsChange,
    isCombined,
    isArrivals,
    trackingLocation,
    onFieldChanged,
}: {
    columns: TileColumnDB[]
    onColumnsChange: (columns: TileColumnDB[]) => void
    isCombined: boolean
    isArrivals: boolean
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    onFieldChanged: (field: string) => void
}) {
    const { capture } = usePosthogTracking()
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)

    function onChange(
        e: React.ChangeEvent<HTMLInputElement>,
        key: keyof typeof TileColumns,
    ) {
        onColumnsChange(
            e.target.checked
                ? [...columns, key]
                : columns.filter((column) => column !== key),
        )
        onFieldChanged('columns')
        capture('stop_place_edit_interaction', {
            location: trackingLocation,
            field: 'columns',
            column_value: COLUMN_TRACKING_VALUE[key],
            action: e.target.checked ? 'toggled_on' : 'toggled_off',
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <Heading5 as="h2">
                Hvilke kolonner vil du at skal vises på tavla?
            </Heading5>
            {isCombined && (
                <SubParagraph className="mb-2 !text-error">
                    Har du samlet stoppestedene i én liste vil du ikke ha
                    mulighet til å velge kolonner.
                </SubParagraph>
            )}

            <ColumnModal
                isOpen={isColumnModalOpen}
                setIsOpen={setIsColumnModalOpen}
            />
            {!isCombined && (
                <div className="flex flex-row flex-wrap gap-1">
                    {typedEntries(TileColumns)
                        .filter(([key]) =>
                            isArrivals
                                ? key !== 'arrivalTime'
                                : key !== 'fromStopPlace',
                        )
                        .map(([key, value]) => (
                            <FilterChip
                                key={key}
                                value={key}
                                disabled={isCombined}
                                checked={columns.includes(key)}
                                onChange={(e) => onChange(e, key)}
                            >
                                {value}
                            </FilterChip>
                        ))}
                </div>
            )}
        </div>
    )
}
