import React from 'react'

import { Heading3 } from '@entur/typography'

import { Settings } from '../../../settings'
import { ThemeDashbboardPreview } from '../../../assets/icons/ThemeDashboardPreview'

import './styles.scss'

function BoardCard({ settings, id, callback, className }: Props): JSX.Element {
    const preview = ThemeDashbboardPreview(settings.theme)
    const dashboardType = settings.dashboard ? settings.dashboard : 'Chrono'

    return (
        <div className={`board-card ${className}`} onClick={callback}>
            <img
                className="board-card__preview"
                src={preview[`${dashboardType}`]}
            />
            <div className="board-card__text-container">
                <Heading3
                    className="board-card__text-container__title"
                    margin="none"
                >
                    {'title'}
                </Heading3>
                <span className="board-card__text-container__description">
                    {id}
                </span>
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
