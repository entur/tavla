import { TSettings } from 'types/settings'
import { IconButton } from '@entur/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverCloseButton,
} from '@entur/tooltip'
import { CloseIcon, OutlinedValidationInfoIcon } from '@entur/icons'
import { Heading5 } from '@entur/typography'
import classes from './styles.module.css'
function Info({ board }: { board: { id: string; settings?: TSettings } }) {
    return (
        <Popover>
            <PopoverTrigger>
                <IconButton aria-label="Se mer informasjon om tavle">
                    <OutlinedValidationInfoIcon />
                </IconButton>
            </PopoverTrigger>
            <PopoverContent>
                <div className={classes.popover}>
                    <div className={classes.header}>
                        <Heading5 className={classes.heading}>
                            {board.settings?.tiles.length} holdeplasser i Tavla
                        </Heading5>
                        <PopoverCloseButton>
                            <IconButton aria-label="Lukk popover">
                                <CloseIcon aria-hidden="true" />
                            </IconButton>
                        </PopoverCloseButton>
                    </div>
                    <div className={classes.list}>
                        {board.settings?.tiles.map((tile) => (
                            <div key={tile.uuid}>{tile.name}</div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export { Info }
