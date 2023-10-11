import { FormEvent, useState } from 'react'
import { Heading3 } from '@entur/typography'
import { Button } from '@entur/button'
import { TextField } from '@entur/form'
import { TTag } from 'types/meta'

function AddNewTag({ addTag }: { addTag: (tag: TTag) => void }) {
    const [newTagName, setNewTagName] = useState<TTag>()

    const submitHandler = (e: FormEvent) => {
        e.preventDefault()
        if (newTagName && newTagName.length > 0) {
            addTag(newTagName)
            setNewTagName('')
        }
    }

    return (
        <div className="flexCol g-1">
            <Heading3>Legg til ny merkelapp</Heading3>
            <form onSubmit={submitHandler}>
                <div className="flexRow g-1 w-100">
                    <TextField
                        aria-label="Navn på ny merkelapp"
                        label="Merkelapp"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                    />
                    <Button type="submit" variant="primary">
                        Legg til
                    </Button>
                </div>
            </form>
        </div>
    )
}

export { AddNewTag }
