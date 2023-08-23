import { SecondarySquareButton } from '@entur/button'
import { TextField } from '@entur/form'
import { CheckIcon, CloseIcon, EditIcon } from '@entur/icons'
import { Heading1 } from '@entur/typography'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { useState } from 'react'
import classes from './styles.module.css'

function BoardTitle({ title }: { title?: string }) {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const dispatch = useSettingsDispatch()
    const displayTitle = title || 'Tavla'
    const [tempTitle, setTempTitle] = useState<string>(displayTitle)

    if (!isEditing) {
        return (
            <div className={classes.leftContainer}>
                <Heading1 className={classes.title}>{displayTitle}</Heading1>
                <SecondarySquareButton
                    className={classes.squareButton}
                    onClick={() => setIsEditing(true)}
                >
                    <EditIcon aria-label="Rediger tittel" />
                </SecondarySquareButton>
            </div>
        )
    }

    return (
        <div className={classes.leftContainer}>
            <TextField
                defaultValue={displayTitle}
                size="medium"
                label="Tavlenavn"
                className={classes.editInput}
                onChange={(e) => setTempTitle(e.target.value)}
            />
            <SecondarySquareButton
                className={classes.squareButton}
                onClick={() => {
                    setIsEditing(false)
                    dispatch({
                        type: 'changeTitle',
                        title: tempTitle,
                    })
                }}
            >
                <CheckIcon aria-label="Bekreft tittelendring" />
            </SecondarySquareButton>
            <SecondarySquareButton
                className={classes.squareButton}
                onClick={() => {
                    setTempTitle(displayTitle)
                    setIsEditing(false)
                }}
            >
                <CloseIcon aria-label="Avbryt tittelendring" />
            </SecondarySquareButton>
        </div>
    )
}

export default BoardTitle
