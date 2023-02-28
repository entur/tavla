import React, { useCallback, useEffect, useState } from 'react'
import { updateFirebaseSettings } from 'settings/firebase'
import { IconButton } from '@entur/button'
import { CheckIcon, CloseIcon, EditIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { Heading2 } from '@entur/typography'
import classes from '../ShareTab.module.scss'

function EditableBoardTitle({
    boardName,
    documentId,
}: {
    documentId: string
    boardName: string
}) {
    const [titleEditMode, setTitleEditMode] = useState<boolean>(false)
    const [newBoardName, setNewBoardName] = useState<string>(boardName)

    useEffect(() => {
        setNewBoardName(boardName)
    }, [boardName])

    const onChangeTitle = useCallback(async () => {
        setTitleEditMode(false)
        if (newBoardName === boardName) return
        try {
            await updateFirebaseSettings(documentId, {
                boardName: newBoardName,
            })
        } catch {
            throw new Error('Could not change board name.')
        }
    }, [boardName, documentId, newBoardName])

    if (titleEditMode) {
        return (
            <span className={classes.Title}>
                <input
                    className={classes.EditTitleInput}
                    defaultValue={boardName}
                    autoFocus={true}
                    onChange={(e) => setNewBoardName(e.currentTarget.value)}
                    onKeyDown={(e): void => {
                        if (e.key === 'Enter') onChangeTitle()
                    }}
                />
                <Tooltip placement="bottom" content="Lagre navn">
                    <IconButton
                        onClick={onChangeTitle}
                        className={classes.EditTitleButton}
                    >
                        <CheckIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip placement="bottom" content="Avbryt">
                    <IconButton
                        onClick={() => setTitleEditMode(false)}
                        className={classes.EditTitleButton}
                    >
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
            </span>
        )
    }

    return (
        <Heading2 className={classes.Title} margin="none" as="span">
            {boardName}
            <Tooltip placement="bottom" content="Endre navn">
                <IconButton
                    onClick={() => setTitleEditMode(true)}
                    className={classes.EditTitleButton}
                >
                    <EditIcon size={20} />
                </IconButton>
            </Tooltip>
        </Heading2>
    )
}

export { EditableBoardTitle }
