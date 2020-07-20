import React from 'react'

import { Heading3, Paragraph } from '@entur/typography'

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
            <div className="board-card__radio-container">
                <div className="board-card__radio-container__header-wrapper">
                    <Heading3
                        className="board-card__radio-container__header-wrapper__title"
                        margin="none"
                    >
                        {'title'}
                    </Heading3>
                </div>
                <Paragraph className="board-card__radio-container__description">
                    {id}
                </Paragraph>
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
