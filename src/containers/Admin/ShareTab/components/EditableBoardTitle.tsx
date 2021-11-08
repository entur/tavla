import React, { useState } from 'react'

import { IconButton } from '@entur/button'
import { CheckIcon, CloseIcon, EditIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { Heading2 } from '@entur/typography'

import { useSettingsContext } from '../../../../settings'

export const EditableBoardTitle = (): JSX.Element => {
    const [settings, setSettings] = useSettingsContext()

    const [titleEditMode, setTitleEditMode] = useState<boolean>(false)
    const [newBoardName, setNewBoardName] = useState<string>(
        settings?.boardName as string,
    )

    const onChangeTitle = () => {
        setTitleEditMode(false)
        if (newBoardName === settings?.boardName) return
        setSettings({ boardName: newBoardName })
    }

    if (titleEditMode) {
        return (
            <span className="share-page__title">
                <input
                    className="share-page__title--input"
                    defaultValue={settings?.boardName}
                    autoFocus={true}
                    onChange={(e) => setNewBoardName(e.currentTarget.value)}
                    onKeyUp={(e): void => {
                        if (e.key === 'Enter') onChangeTitle()
                    }}
                />
                <Tooltip placement="bottom" content="Lagre navn">
                    <IconButton
                        onClick={onChangeTitle}
                        className="share-page__title__button"
                    >
                        <CheckIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip placement="bottom" content="Avbryt">
                    <IconButton
                        onClick={() => setTitleEditMode(false)}
                        className="share-page__title__button"
                    >
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
            </span>
        )
    } else
        return (
            <Heading2 className="share-page__title" margin="none" as="span">
                {settings?.boardName}
                <Tooltip placement="bottom" content="Endre navn">
                    <IconButton
                        onClick={() => setTitleEditMode(true)}
                        className="share-page__title__button"
                    >
                        <EditIcon size={20} />
                    </IconButton>
                </Tooltip>
            </Heading2>
        )
}

export default EditableBoardTitle
