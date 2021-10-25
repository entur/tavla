import React, { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'

import type { Timestamp } from 'firebase/firestore'

import { Heading3 } from '@entur/typography'
import { LinkIcon, ClockIcon } from '@entur/icons'

import { ThemeDashboardPreview } from '../../../assets/icons/ThemeDashboardPreview'
import { persistSingleField } from '../../../settings/FirestoreStorage'
import { Settings, useSettingsContext } from '../../../settings'

import BoardOverflowMenu from './OverflowMenu'
import './styles.scss'

const DAYS = ['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør']

const MONTHS = [
    'januar',
    'februar',
    'mars',
    'april',
    'mai',
    'juni',
    'juli',
    'august',
    'september',
    'oktober',
    'november',
    'desember',
]

function createTimeString(date: Date, modified: boolean): string {
    const currentYear = new Date().getFullYear()

    const dateString = `${DAYS[date.getDay()]} ${date.getDate()}. ${
        MONTHS[date.getMonth()]
    }`
    const hours = `${date.getHours()}`.padStart(2, '0')
    const minutes = `${date.getMinutes()}`.padStart(2, '0')
    const timeString = `${hours}:${minutes}`
    const yearString =
        currentYear == date.getFullYear() ? '' : `${date.getFullYear()}`
    const prependWords = modified ? 'Sist endret' : 'Ble laget'
    return `${prependWords} ${dateString} ${yearString} ${timeString}`
}

function BoardCard({
    settings,
    id,
    uid,
    timestamp,
    created,
    className,
    history,
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
            ? createTimeString(
                  preferredDate.toDate(),
                  preferredDate == timestamp,
              )
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
                            history={history}
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
    history: any
}

export default BoardCard
