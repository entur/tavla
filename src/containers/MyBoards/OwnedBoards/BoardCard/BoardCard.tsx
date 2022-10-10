import React, { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'

import type { Timestamp } from 'firebase/firestore'

import { Heading3 } from '@entur/typography'
import { LinkIcon, ClockIcon } from '@entur/icons'

import { ThemeDashboardPreview } from '../../../../assets/icons/ThemeDashboardPreview'
import { persistSingleField } from '../../../../settings/FirestoreStorage'
import { Settings } from '../../../../settings'
import { createTimeString } from '../../../../utils'

import { BoardOverflowMenu } from './OverflowMenu/BoardOverflowMenu'
import './BoardCard.scss'

function BoardCard({
    settings,
    id,
    uid,
    timestamp,
    created,
    className,
}: Props): JSX.Element {
    const [titleEditMode, setTitleEditMode] = useState<boolean>(false)
    const [boardTitle, setBoardTitle] = useState<string>('Uten tittel')

    useEffect(() => {
        if (!settings.boardName) return
        setBoardTitle(settings.boardName)
    }, [settings.boardName])

    const onClickTitle = useCallback(() => {
        setTitleEditMode(true)
    }, [setTitleEditMode])

    const onChangeTitle = useCallback(
        (
            event:
                | React.FocusEvent<HTMLInputElement>
                | React.KeyboardEvent<HTMLInputElement>,
        ) => {
            event.preventDefault()
            const newTitle = event.currentTarget.value
            setTitleEditMode(false)
            if (newTitle == settings.boardName) return

            setBoardTitle(newTitle)
            persistSingleField(id, 'boardName', newTitle)
        },
        [id, settings.boardName],
    )

    const preview = ThemeDashboardPreview(settings.theme)
    const dashboardType = settings.dashboard || 'Chrono'
    const preferredDate = timestamp ? timestamp : created
    const timeString =
        preferredDate != undefined
            ? (preferredDate === timestamp ? 'Sist endret ' : 'Ble laget ') +
              createTimeString(preferredDate.toDate())
            : 'Ikke endret'
    const boardTitleElement = titleEditMode ? (
        <input
            className="board-card__text-container__top-wrapper__title"
            defaultValue={boardTitle}
            autoFocus={true}
            onBlur={onChangeTitle}
            onKeyUp={(e): void => {
                e.preventDefault()
                if (e.keyCode == 13) onChangeTitle(e)
            }}
        />
    ) : (
        <Heading3
            className="board-card__text-container__top-wrapper__title"
            margin="none"
            as="span"
            onClick={onClickTitle}
        >
            {boardTitle}
        </Heading3>
    )

    return (
        <div className={`board-card ${className ? className : ''}`}>
            <Link to={`/t/${id}`}>
                <div className="board-card__preview">
                    <img src={preview[`${dashboardType}`]} />
                </div>
            </Link>

            <div className="board-card__text-container">
                <div className="board-card__text-container__header-container">
                    <div className="board-card__text-container__top-wrapper">
                        {boardTitleElement}
                    </div>
                    <div>
                        <BoardOverflowMenu
                            id={id}
                            uid={uid}
                            sharedBoard={
                                settings.owners
                                    ? settings.owners?.length > 1
                                    : false
                            }
                        />
                    </div>
                </div>

                <div className="board-card__text-container__text">
                    <ClockIcon className="board-card__text-container__text__icon" />
                    <span className="board-card__text-container__text__description">
                        {timeString}
                    </span>
                </div>
                <div className="board-card__text-container__text">
                    <LinkIcon className="board-card__text-container__text__icon" />
                    <span className="board-card__text-container__text__description">
                        {`${window.location.host}/t/${id}`}
                    </span>
                </div>
            </div>
        </div>
    )
}

interface Props {
    settings: Settings
    id: string
    uid: string
    timestamp: Timestamp
    created: Timestamp
    className?: string
}

export { BoardCard }
