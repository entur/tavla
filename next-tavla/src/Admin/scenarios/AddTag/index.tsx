import { useState } from 'react'
import { ActionChip } from '@entur/chip'
import { AddIcon, CloseIcon } from '@entur/icons'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverCloseButton,
} from '@entur/tooltip'
import { Heading4 } from '@entur/typography'
import { Button, IconButton } from '@entur/button'
import { TextField } from '@entur/form'
import classes from './styles.module.css'

function AddTag({
    addTagToBoardHandler,
}: {
    tags: string[]
    addTagToBoardHandler: (tag: string) => void
}) {
    const [newTagName, setNewTagName] = useState<string | undefined>(undefined)

    return (
        <Popover>
            <PopoverTrigger>
                <ActionChip>
                    <AddIcon aria-hidden />
                    Legg til
                </ActionChip>
            </PopoverTrigger>
            <PopoverContent>
                <div className={classes.popoverContent}>
                    <div className={classes.popoverHeader}>
                        <Heading4>Legg til tag</Heading4>
                        <PopoverCloseButton>
                            <IconButton aria-label="Lukk popover">
                                <CloseIcon aria-hidden="true" />
                            </IconButton>
                        </PopoverCloseButton>
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            newTagName && addTagToBoardHandler(newTagName)
                            setNewTagName('')
                        }}
                    >
                        <div className={classes.createNewTag}>
                            <TextField
                                aria-label="Navn på ny tag"
                                label="Tag"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                            ></TextField>
                            <Button type="submit" variant="primary">
                                Legg til
                            </Button>
                        </div>
                    </form>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export { AddTag }
