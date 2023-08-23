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

                <Heading1 className={classes.title}>{displayTitle}</Heading1>

    return (
        <div className={classes.leftContainer}>
            {isEditing ? (
                <>
                    <TextField
                        size="medium"
                        label="Tavlenavn"
                        className={classes.editInput}
                    />

                    <SecondarySquareButton
                        className={classes.squareButton}
                        onClick={() => {
                            setIsEditing(false)
                            dispatch({
                                type: 'changeTitle',
                            })
                        }}
                    >
                        <CheckIcon aria-label="Bekreft tittelendring" />
                    </SecondarySquareButton>
                    <SecondarySquareButton
                        className={classes.squareButton}
                        onClick={() => {
                            setIsEditing(false)
                        }}
                    >
                        <CloseIcon aria-label="Avbryt tittelendring" />
                    </SecondarySquareButton>
                </>
            ) : (
                <>
                    <Heading1
                        className={classes.title}
                    >
                    </Heading1>
                    <SecondarySquareButton
                        className={classes.squareButton}
                        onClick={() => setIsEditing(true)}
                    >
                        <EditIcon aria-label="Rediger tittel" />
                    </SecondarySquareButton>
                </>
            )}
                defaultValue={displayTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                        title: tempTitle,
                    setTempTitle(displayTitle)
        </div>
    )
}

export default BoardTitle
