import { IconButton, SecondarySquareButton } from '@entur/button'
import { CloseIcon, DownwardIcon, SettingsIcon, UpwardIcon } from '@entur/icons'
import classes from './styles.module.css'
import {
    Popover,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger,
} from '@entur/tooltip'
import { Heading4 } from '@entur/typography'
import { Checkbox } from '@entur/form'
import {
    useBoardsSettings,
    useBoardsSettingsDispatch,
} from '../../utils/context'
import { BoardsColumns, TBoardsColumn } from 'Admin/types/boards'
import { isNotNullOrUndefined } from 'utils/typeguards'

function ToggleBoardsColumns() {
    const { columns, columnOrder } = useBoardsSettings()
    const dispatch = useBoardsSettingsDispatch()

    function swapColumns(index1: number, index2: number) {
        const newColumnOrder: (TBoardsColumn | undefined)[] = [...columnOrder]
        newColumnOrder[index1] = columnOrder[index2]
        newColumnOrder[index2] = columnOrder[index1]
        if (newColumnOrder.every(isNotNullOrUndefined))
            dispatch({ type: 'setColumnOrder', columnOrder: newColumnOrder })
    }

    return (
        <Popover>
            <PopoverTrigger>
                <SecondarySquareButton className={classes.boardListOptions}>
                    <SettingsIcon />
                </SecondarySquareButton>
            </PopoverTrigger>
            <PopoverContent>
                <div className={classes.popoverContent}>
                    <div className={classes.popoverHeading}>
                        <Heading4 className={classes.heading}>
                            Velg kolonner
                        </Heading4>
                        <PopoverCloseButton>
                            <IconButton aria-label="Lukk popover">
                                <CloseIcon aria-hidden="true" />
                            </IconButton>
                        </PopoverCloseButton>
                    </div>
                    <div className={classes.contentList}>
                        {columnOrder.map((column, index, arr) => (
                            <div key={column} className={classes.checkBoxLine}>
                                <div className={classes.orderButtons}>
                                    {index > 0 && (
                                        <UpwardIcon
                                            className={classes.up}
                                            onClick={() =>
                                                swapColumns(index, index - 1)
                                            }
                                        />
                                    )}
                                    {index < arr.length - 1 && (
                                        <DownwardIcon
                                            className={classes.down}
                                            onClick={() =>
                                                swapColumns(index, index + 1)
                                            }
                                        />
                                    )}
                                </div>
                                <Checkbox
                                    key={column}
                                    checked={columns.includes(
                                        column as TBoardsColumn,
                                    )}
                                    onChange={() =>
                                        dispatch({
                                            type: 'toggleColumn',
                                            column: column,
                                        })
                                    }
                                >
                                    {BoardsColumns[column]}
                                </Checkbox>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export { ToggleBoardsColumns }
