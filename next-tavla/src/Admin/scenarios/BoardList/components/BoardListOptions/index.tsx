import { IconButton, SecondarySquareButton } from '@entur/button'
import { CloseIcon, SettingsIcon } from '@entur/icons'
import classes from './styles.module.css'
import {
    Popover,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger,
} from '@entur/tooltip'
import { Heading4 } from '@entur/typography'
import { Checkbox } from '@entur/form'
import { Dispatch, SetStateAction } from 'react'
import { uniqueArrayItems } from 'utils/uniqueArrayItems'
import { TOptionalColumn } from 'types/optionalColumns'

function BoardListOptions({
    optionalColumns,
    shownOptionalColumns,
    setShownOptionalColumns,
}: {
    optionalColumns: TOptionalColumn[]
    shownOptionalColumns: TOptionalColumn[]
    setShownOptionalColumns: Dispatch<SetStateAction<TOptionalColumn[]>>
}) {
    const handleCheckboxChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        column: TOptionalColumn,
    ) => {
        const checked = e.target.checked
        if (checked) {
            setShownOptionalColumns((shownColumns) =>
                uniqueArrayItems([...shownColumns, column]),
            )
        } else {
            setShownOptionalColumns((shownColumns) =>
                uniqueArrayItems(
                    shownColumns.filter(
                        (shownColumn) => shownColumn !== column,
                    ),
                ),
            )
        }
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
                        {optionalColumns.map((column) => (
                            <Checkbox
                                key={column.name}
                                checked={shownOptionalColumns.includes(column)}
                                onChange={(e) =>
                                    handleCheckboxChange(e, column)
                                }
                            >
                                {column.label}
                            </Checkbox>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export { BoardListOptions }
