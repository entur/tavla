'use client'
import { IconButton, SecondaryButton } from '@entur/button'
import { AdjustmentsIcon, CloseIcon } from '@entur/icons'
import classes from './styles.module.css'
import {
    Popover,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger,
} from '@entur/tooltip'
import { Heading2 } from '@entur/typography'
import { Checkbox } from '@entur/form'
import {
    BoardsColumns,
    DEFAULT_BOARD_COLUMNS,
    TBoardsColumn,
} from 'Admin/types/boards'
import { isEqual, xor } from 'lodash'
import { useSearchParamReplacer } from '../../hooks/useSearchParamReplacer'

function ToggleBoardsColumns() {
    const [value, replace] = useSearchParamReplacer('columns')
    const columns = value?.split(',') ?? DEFAULT_BOARD_COLUMNS

    const updateColumns = (column: TBoardsColumn) => {
        const newColumns = xor(columns, [column])
        if (isEqual(newColumns, DEFAULT_BOARD_COLUMNS)) {
            return replace(undefined)
        }

        replace(newColumns.join(','))
    }

    return (
        <Popover>
            <PopoverTrigger>
                <SecondaryButton>
                    Velg kolonner
                    <AdjustmentsIcon aria-hidden="true" />
                </SecondaryButton>
            </PopoverTrigger>
            <PopoverContent>
                <div className="p-1">
                    <div className="flexRow">
                        <Heading2 className="m-1 text-rem-2">
                            Velg kolonner
                        </Heading2>
                        <PopoverCloseButton>
                            <IconButton aria-label="Lukk popover">
                                <CloseIcon aria-hidden="true" />
                            </IconButton>
                        </PopoverCloseButton>
                    </div>
                    <div className={classes.contentList}>
                        {Object.entries(BoardsColumns).map(([column]) => (
                            <Checkbox
                                key={column}
                                checked={columns.includes(
                                    column as TBoardsColumn,
                                )}
                                onChange={() =>
                                    updateColumns(column as TBoardsColumn)
                                }
                            >
                                {BoardsColumns[column as TBoardsColumn]}
                            </Checkbox>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export { ToggleBoardsColumns }
