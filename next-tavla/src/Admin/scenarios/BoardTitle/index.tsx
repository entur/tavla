import { SecondarySquareButton } from '@entur/button'
import { TextField } from '@entur/form'
import { CheckIcon, CloseIcon, EditIcon } from '@entur/icons'
import { Heading1 } from '@entur/typography'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { useState } from 'react'
import classes from './styles.module.css'

function BoardTitle({ title }: { title?: string }) {
    const [isEditing, setIsEditing] = useState(false)
    const dispatch = useSettingsDispatch()
    const boardTitle = title || 'Tavla'
    const [tempTitle, setTempTitle] = useState(boardTitle)

    if (!isEditing) {
        return (
            <div className={classes.editTitle}>
                <Heading1 className={classes.title}>{boardTitle}</Heading1>
                <SecondarySquareButton
                    className={classes.squareButton}
                    onClick={() => {
                        setIsEditing(true)
                    }}
                >
                    <EditIcon aria-label="Rediger tittel" />
                </SecondarySquareButton>
            </div>
        )
    }

    return (
        <div className={classes.editTitle}>
            <TextField
                id="boardTitle-input"
                defaultValue={boardTitle}
                size="medium"
                label="Navn på tavlen"
                onChange={(e) => setTempTitle(e.target.value)}
            />
            <SecondarySquareButton
                className={classes.squareButton}
                onClick={() => {
                    setIsEditing(false)
                    dispatch({
                        type: 'setTitle',
                        title: tempTitle,
                    })
                }}
            >
                <CheckIcon aria-label="Bekreft tittelendring" />
            </SecondarySquareButton>
            <SecondarySquareButton
                className={classes.squareButton}
                onClick={() => {
                    setTempTitle(boardTitle)
                    setIsEditing(false)
                }}
            >
                <CloseIcon aria-label="Avbryt tittelendring" />
            </SecondarySquareButton>
        </div>
    )
}

export { BoardTitle }
