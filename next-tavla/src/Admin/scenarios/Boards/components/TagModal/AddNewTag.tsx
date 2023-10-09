import { FormEvent, useState } from 'react'
import { Heading3 } from '@entur/typography'
import { Button } from '@entur/button'
import { TextField } from '@entur/form'
import classes from './styles.module.css'
import { TTag } from 'types/meta'

function AddNewTag({ addTag }: { addTag: (tag: TTag) => void }) {
    const [newTagName, setNewTagName] = useState<TTag | undefined>(undefined)

    const submitHandler = (e: FormEvent) => {
        e.preventDefault()
        if (newTagName && newTagName.length > 0) {
            addTag(newTagName)
            setNewTagName('')
        }
    }

    return (
        <div className="flexCol g-1">
            <div className={classes.popoverHeader}>
                <Heading3>Legg til ny merkelapp</Heading3>
            </div>
            <form onSubmit={submitHandler}>
                <div className="flexRow w-100">
                    <TextField
                        aria-label="Navn på ny merkelapp"
                        label="Merkelapp"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                    ></TextField>
                    <Button type="submit" variant="primary">
                        Legg til
                    </Button>
                </div>
            </form>
        </div>
    )
}

export { AddNewTag }
