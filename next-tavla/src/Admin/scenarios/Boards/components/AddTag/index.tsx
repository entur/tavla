import { FormEvent, useState } from 'react'
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
import { useBoardsSettingsDispatch } from '../../utils/context'
import { TBoardID } from 'types/settings'

function AddTag({ boardId }: { boardId: TBoardID }) {
    const dispatch = useBoardsSettingsDispatch()

    const [newTagName, setNewTagName] = useState<string | undefined>(undefined)

    const addTag = (e: FormEvent) => {
        e.preventDefault()
        newTagName &&
            dispatch({
                type: 'addTag',
                boardId,
                tag: newTagName,
            })
        setNewTagName('')
    }

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
                    <form onSubmit={addTag}>
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
