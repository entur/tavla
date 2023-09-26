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
import {
    useBoardsSettings,
    useBoardsSettingsDispatch,
} from '../../utils/context'
import { CheckboxList } from './CheckBoxList'

function ToggleBoardsColumns() {
    const { columns, columnOrder } = useBoardsSettings()
    const dispatch = useBoardsSettingsDispatch()

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
                        <CheckboxList
                            columnOrder={columnOrder}
                            columns={columns}
                            dispatch={dispatch}
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export { ToggleBoardsColumns }
