import React from 'react'

import { Heading3 } from '@entur/typography'
import { LinkIcon, ClockIcon } from '@entur/icons'

import { Settings } from '../../../settings'
import { ThemeDashbboardPreview } from '../../../assets/icons/ThemeDashboardPreview'

import './styles.scss'

function BoardCard({ settings, id, callback, className }: Props): JSX.Element {
    const preview = ThemeDashbboardPreview(settings.theme)
    const dashboardType = settings.dashboard ? settings.dashboard : 'Chrono'

    return (
        <div className={`board-card ${className}`} onClick={callback}>
            <a href={`/t/${id}`}>
                <img
                    className="board-card__preview"
                    src={preview[`${dashboardType}`]}
                />
            </a>

            <div className="board-card__text-container">
                <Heading3
                    className="board-card__text-container__title"
                    margin="none"
                >
                    {'title'}
                </Heading3>
                <div className="board-card__text-container__text">
                    <ClockIcon className="board-card__text-container__text__icon" />
                    <span className="board-card__text-container__text__description">
                        {`Sist endret`}
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
    callback?: () => void
    className?: string
}

export default BoardCard
