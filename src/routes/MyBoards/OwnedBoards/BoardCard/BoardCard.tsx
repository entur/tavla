import React, { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Timestamp } from 'firebase/firestore'
import classNames from 'classnames'
import { ThemeDashboardPreview } from 'assets/icons/ThemeDashboardPreview'
import { persistSingleField } from 'settings/FirestoreStorage'
import { createTimeString } from 'utils/time'
import { Settings } from 'settings/settings'
import { LinkIcon, ClockIcon } from '@entur/icons'
import { Heading3 } from '@entur/typography'
import { BoardOverflowMenu } from './OverflowMenu/BoardOverflowMenu'
import classes from './BoardCard.module.scss'

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
            className={classNames(classes.TitleInput, className)}
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
        <div className={classes.BoardCard}>
            <Link to={`/t/${id}`}>
                <div className={classes.Preview}>
                    <img
                        src={preview[dashboardType]}
                        className={classes.PreviewImage}
                    />
                </div>
            </Link>
            <div className={classes.BoardTitle}>
                {boardTitleElement}
                <BoardOverflowMenu
                    id={id}
                    uid={uid}
                    sharedBoard={
                        settings.owners ? settings.owners?.length > 1 : false
                    }
                />
            </div>
            <div className={classes.InfoText}>
                <ClockIcon />
                {timeString}
            </div>
            <div className={classes.InfoText}>
                <LinkIcon />
                {`${window.location.host}/t/${id}`}
            </div>
        </div>
    )
}

type Props = {
    settings: Settings
    id: string
    uid: string
    timestamp: Timestamp
    created: Timestamp
    className?: string
}

export { BoardCard }
