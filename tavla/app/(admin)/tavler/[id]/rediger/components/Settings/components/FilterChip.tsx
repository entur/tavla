'use client'
import { Columns, TColumn } from 'types/column'
import { ChoiceChipGroupGeneral } from './ChoiceChipGroupGeneral'
import { Heading3, SubParagraph } from '@entur/typography'
import { Tooltip } from '@entur/tooltip'
import { IconButton } from '@entur/button'
import { QuestionFilledIcon } from '@entur/icons'

function FilterChip({
    columns = [],
    onChange,
    isCombined = false,
    setIsColumnModalOpen,
}: {
    columns?: TColumn[]
    onChange?: (value: TColumn[]) => void
    isCombined?: boolean
    setIsColumnModalOpen: (value: boolean) => void
}) {
    return (
        <ChoiceChipGroupGeneral<TColumn>
            header={
                <div className="flex flex-row items-baseline gap-1">
                    <Heading3>Kolonner</Heading3>
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
            }
            description={
                <>
                    <SubParagraph>
                        Her bestemmer du hvilke kolonner som skal vises i
                        tavlen.
                    </SubParagraph>
                    {isCombined && (
                        <SubParagraph className="!text-error mb-2">
                            Har du samlet stoppestedene i én liste vil du ikke
                            ha mulighet til å velge kolonner.
                        </SubParagraph>
                    )}
                </>
            }
            options={Object.entries(Columns).map(([key, value]) => ({
                value: key as TColumn,
                label: value,
            }))}
            defaultValue={isCombined ? [] : columns}
            name="columns"
            ariaLabel="Kolonner"
            multiSelect
            onChange={(value) => {
                if (!Array.isArray(value)) return
                onChange?.(value)
            }}
        />
    )
}

export { FilterChip }
