import { TSettings } from 'types/settings'
import { IconButton } from '@entur/button'
import { Popover, PopoverContent, PopoverTrigger } from '@entur/tooltip'
import { CloseIcon, OutlinedValidationInfoIcon } from '@entur/icons'
import { Heading5 } from '@entur/typography'
import classes from './styles.module.css'
import { useState } from 'react'
function Info({ board }: { board: { id: string; settings?: TSettings } }) {
    const [show, setShow] = useState(false)
    return (
        <Popover showPopover={show} setShowPopover={setShow}>
            <PopoverTrigger>
                <IconButton
                    aria-label="Se mer informasjon om tavle"
                    onClick={() => setShow(true)}
                >
                    <OutlinedValidationInfoIcon />
                </IconButton>
            </PopoverTrigger>
            <PopoverContent>
                <div className={classes.popover}>
                    <div className={classes.header}>
                        <Heading5 className={classes.heading}>
                            {board.settings?.tiles.length} holdeplasser i Tavla
                        </Heading5>
                        <IconButton
                            aria-label="Lukk popover"
                            onClick={() => setShow(false)}
                            className={classes.closeButton}
                        >
                            <CloseIcon aria-hidden="true" />
                        </IconButton>
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
