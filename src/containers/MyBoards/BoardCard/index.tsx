import React, { useState, useRef, useCallback } from 'react'

import { Heading3 } from '@entur/typography'
import { LinkIcon, ClockIcon } from '@entur/icons'

import { Settings } from '../../../settings'
import { ThemeDashbboardPreview } from '../../../assets/icons/ThemeDashboardPreview'

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

function createTimeString(date: Date): string {
    const timestring = `${DAYS[date.getDay()]} ${date.getDate()}. ${
        MONTHS[date.getMonth()]
    }`
    const hours = `${date.getHours()}`.padStart(2, '0')
    const minutes = `${date.getMinutes()}`.padStart(2, '0')
    const time = `${hours}:${minutes}`
    return `Sist endret ${timestring} ${time}`
}

function BoardCard({ settings, id, timestamp, className }: Props): JSX.Element {
    const [titleEditMode, setTitleEditMode] = useState<boolean>(false)

    const preview = ThemeDashbboardPreview(settings.theme)
    const dashboardType = settings.dashboard ? settings.dashboard : 'Chrono'
    const timeString = timestamp
        ? createTimeString(timestamp.toDate())
        : 'Ikke endret'
    const boardTitle = settings.boardName ? settings.boardName : 'Uten navn'
    const boardTitleEditorRef = useRef<HTMLInputElement>()
    const boardTitleElement = titleEditMode ? (
        <input
            className="board-card__text-container__title"
            defaultValue={boardTitle}
            ref={boardTitleEditorRef}
            autoFocus={true}
        />
    ) : (
        <Heading3 className="board-card__text-container__title" margin="none">
            {boardTitle}
        </Heading3>
    )

    const onClickTitle = useCallback(() => {
        event.preventDefault()
        setTitleEditMode(true)
    }, [setTitleEditMode])

    const onBlurTitle = useCallback(() => {
        event.preventDefault()
        setTitleEditMode(false)
        //save new title
    }, [setTitleEditMode])

    return (
        <div className={`board-card ${className ? className : ''}`}>
            <a href={`/t/${id}`}>
                <img
                    className="board-card__preview"
                    src={preview[`${dashboardType}`]}
                />
            </a>

            <div className="board-card__text-container">
                <span onClick={onClickTitle} onBlur={onBlurTitle}>
                    {boardTitleElement}
                </span>

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
    timestamp: firebase.firestore.Timestamp
    className?: string
}

export default BoardCard
