import { IconButton } from '@entur/button'
import { FilterChip } from '@entur/chip'
import { QuestionFilledIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { Heading4, SubParagraph } from '@entur/typography'
import { DEFAULT_COMBINED_COLUMNS } from 'app/(admin)/components/TileSelector/utils'
import { TileContext } from 'app/(admin)/tavler/[id]/rediger/components/TileCard/context'
import { useNonNullContext } from 'hooks/useNonNullContext'
import { isArray } from 'lodash'
import { useState } from 'react'
import { TileColumns } from 'types/db-types/boards'
import { typedEntries } from 'utils/typeguards'
import { ColumnModal } from '../ColumnModal'

function SetColumns({ isCombined }: { isCombined: boolean }) {
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
                    return (
                        <FilterChip
                            name="columns"
                            key={key}
                            value={key}
                            disabled={isCombined}
                            defaultChecked={
                                isArray(columns) && columns.includes(key)
                            }
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
