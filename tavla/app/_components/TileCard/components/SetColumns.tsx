import { SmallAlertBox } from '@entur/alert/'
import { IconButton } from '@entur/button'
import { FilterChip } from '@entur/chip'
import { QuestionFilledIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { Heading4, SubParagraph } from '@entur/typography'
import type { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { isArray } from 'lodash'
import { useState } from 'react'
import { useNonNullContext } from 'src/hooks/useNonNullContext'
import { TileColumns } from 'src/types/db-types/boards'
import { typedEntries } from 'src/utils/typeguards'
import { ColumnModal } from '../ColumnModal'
import { TileContext } from '../context'

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
    isCombined,
    isArrivals,
    trackingLocation,
    onFieldChanged,
}: {
    isCombined: boolean
    isArrivals: boolean
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    onFieldChanged: (field: string) => void
}) {
    const posthog = usePosthogTracking()
    const tile = useNonNullContext(TileContext)
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)

    return (
        <>
            <div className="flex flex-row items-baseline gap-1">
                <Heading4>Kolonner</Heading4>

                <Tooltip
                    aria-hidden
                    placement="top"
                    content="Vis forklaring på kolonner"
                    id="tooltip-columns"
                >
                    <IconButton
                        type="button"
                        aria-label="Vis forklaring på kolonner"
                        onClick={() => setIsColumnModalOpen(true)}
                    >
                        <QuestionFilledIcon />
                    </IconButton>
                </Tooltip>
            </div>

            {isCombined ? (
                <SmallAlertBox variant="info" className="mb-2 w-fit">
                    Du har valgt å vise alle stoppesteder i en liste, og kan
                    derfor ikke velge kolonner per stoppested.
                </SmallAlertBox>
            ) : (
                <SubParagraph>
                    Her bestemmer du hvilke kolonner som skal vises i tavlen.
                </SubParagraph>
            )}

            <ColumnModal
                isOpen={isColumnModalOpen}
                setIsOpen={setIsColumnModalOpen}
            />
            {!isCombined && (
                <div className="mb-8 mt-2 flex flex-row flex-wrap gap-4">
                    {typedEntries(TileColumns)
                        .filter(([key]) =>
                            isArrivals
                                ? key !== 'arrivalTime'
                                : key !== 'fromStopPlace',
                        )
                        .map(([key, value]) => (
                            <FilterChip
                                name="columns"
                                key={key}
                                value={key}
                                disabled={isCombined}
                                defaultChecked={
                                    isArray(tile.columns) &&
                                    tile.columns.includes(key)
                                }
                                onChange={(e) => {
                                    onFieldChanged('columns')
                                    posthog.capture(
                                        'stop_place_edit_interaction',
                                        {
                                            location: trackingLocation,
                                            field: 'columns',
                                            column_value:
                                                COLUMN_TRACKING_VALUE[key],
                                            action: e.target.checked
                                                ? 'toggled_on'
                                                : 'toggled_off',
                                        },
                                    )
                                }}
                            >
                                {value}
                            </FilterChip>
                        ))}
                </div>
            )}
        </>
    )
}
