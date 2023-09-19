import { SecondarySquareButton } from '@entur/button'
import { TextField } from '@entur/form'
import { CheckIcon, CloseIcon, EditIcon } from '@entur/icons'
import { Heading1 } from '@entur/typography'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { useCallback, useState } from 'react'
import classes from './styles.module.css'
import { Tooltip } from '@entur/tooltip'

function BoardTitle({ title }: { title?: string }) {
    const [isEditing, setIsEditing] = useState(false)
    const dispatch = useSettingsDispatch()
    const boardTitle = title || 'Tavla'
    const [tempTitle, setTempTitle] = useState(boardTitle)

    const autoSelect = useCallback((ref: HTMLInputElement) => {
        ref.select()
    }, [])

    if (!isEditing) {
        return (
            <div className={classes.editTitle}>
                <Heading1 className={classes.title}>{boardTitle}</Heading1>
                <Tooltip content="Rediger tittel" placement="right">
                    <SecondarySquareButton
                        className={classes.squareButton}
                        onClick={() => setIsEditing(true)}
                    >
                        <EditIcon aria-label="Rediger tittel" />
                    </SecondarySquareButton>
                </Tooltip>
            </div>
        )
    }

    return (
        <div className={classes.editTitle}>
            <TextField
                defaultValue={boardTitle}
                size="medium"
                label="Navn på tavlen"
                onChange={(e) => setTempTitle(e.target.value)}
                ref={autoSelect}
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
