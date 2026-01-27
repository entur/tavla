import { IconButton } from '@entur/button'
import { FilterChip } from '@entur/chip'
import { QuestionFilledIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { Heading4, SubParagraph } from '@entur/typography'
import { DEFAULT_COMBINED_COLUMNS } from 'app/(admin)/components/TileSelector/utils'
import { TileContext } from 'app/(admin)/tavler/[id]/rediger/components/TileCard/context'
import { EventProps } from 'app/posthog/events'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { isArray } from 'lodash'
import { useState } from 'react'
import { useNonNullContext } from 'src/hooks/useNonNullContext'
import { TileColumns } from 'src/types/db-types/boards'
import { typedEntries } from 'src/utils/typeguards'
import { ColumnModal } from '../ColumnModal'

function SetColumns({
    isCombined,
    trackingLocation,
    board_id,
}: {
    isCombined: boolean
    trackingLocation: EventProps<'stop_place_edit_interaction'>['location']
    board_id: string
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
            <SubParagraph>
                Her bestemmer du hvilke kolonner som skal vises i tavlen.
            </SubParagraph>
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
            <div className="mb-8 mt-2 flex flex-row flex-wrap gap-4">
                {typedEntries(TileColumns).map(([key, value]) => {
                    const columns = isCombined
                        ? DEFAULT_COMBINED_COLUMNS
                        : tile.columns

                    const columnValue: Record<
                        string,
                        EventProps<'stop_place_edit_interaction'>['column_value']
                    > = {
                        aimedTime: 'eta',
                        arrivalTime: 'arrival',
                        line: 'line',
                        destination: 'destination',
                        name: 'stop_place',
                        platform: 'platform',
                        time: 'expected',
                    }

                    return (
                        <FilterChip
                            name="columns"
                            key={key}
                            value={key}
                            disabled={isCombined}
                            defaultChecked={
                                isArray(columns) && columns.includes(key)
                            }
                            onChange={(e) => {
                                posthog.capture('stop_place_edit_interaction', {
                                    location: trackingLocation,
                                    board_id: board_id,
                                    field: 'columns',
                                    column_value: columnValue[key]!,
                                    action: e.target.checked
                                        ? 'toggled_on'
                                        : 'toggled_off',
                                })
                            }}
                        >
                            {value}
                        </FilterChip>
                    )
                })}
            </div>
        </>
    )
}

export { SetColumns }
