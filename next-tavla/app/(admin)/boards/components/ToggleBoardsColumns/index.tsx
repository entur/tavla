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
import { useParamsSetter } from 'app/(admin)/boards/hooks/useParamsSetter'
import { useBoardsSettings } from '../../hooks/useBoardsSettings'

function ToggleBoardsColumns() {
    const { updateQuery } = useParamsSetter()
    const { columns } = useBoardsSettings()

    const updateColumns = (column: TBoardsColumn) => {
        if (columns === DEFAULT_BOARD_COLUMNS) {
            DEFAULT_BOARD_COLUMNS.forEach((col) => {
                if (col !== column) updateQuery('columns', col)
            })
            return
        }
        updateQuery('columns', column)
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
