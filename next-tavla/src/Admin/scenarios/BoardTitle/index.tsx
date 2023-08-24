import { SecondarySquareButton } from '@entur/button'
import { TextField } from '@entur/form'
import { CheckIcon, CloseIcon, EditIcon } from '@entur/icons'
import { Heading1 } from '@entur/typography'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import { useState } from 'react'
import classes from './styles.module.css'

function BoardTitle({ title }: { title: string }) {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const dispatch = useSettingsDispatch()

    let newTitle = title

    return (
        <div className={classes.leftContainer}>
            {isEditing ? (
                <>
                    <TextField
                        defaultValue={title}
                        size="medium"
                        label="Tavlenavn"
                        className={classes.editInput}
                        onChange={(e) => (newTitle = e.target.value)}
                    />

                    <SecondarySquareButton
                        className={classes.squareButton}
                        onClick={() => {
                            setIsEditing(false)
                            dispatch({
                                type: 'changeTitle',
                                title: newTitle,
                            })
                        }}
                    >
                        <CheckIcon aria-label="Bekreft tittelendring" />
                    </SecondarySquareButton>
                    <SecondarySquareButton
                        className={classes.squareButton}
                        onClick={() => {
                            newTitle = title
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
                        onClick={() => setIsEditing(true)}
                    >
                        {title}
                    </Heading1>
                    <SecondarySquareButton
                        className={classes.squareButton}
                        onClick={() => setIsEditing(true)}
                    >
                        <EditIcon aria-label="Rediger tittel" />
                    </SecondarySquareButton>
                </>
            )}
        </div>
    )
}

export default BoardTitle
