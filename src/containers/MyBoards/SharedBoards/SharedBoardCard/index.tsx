import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@entur/button'
import { UserIcon } from '@entur/icons'
import { Heading3 } from '@entur/typography'

import { ThemeDashboardPreview } from '../../../../assets/icons/ThemeDashboardPreview'
import type { Theme } from '../../../../types'
import { useUser } from '../../../../auth'
import { answerBoardInvitation } from '../../../../services/firebase'

const SharedBoardCard = ({
    id,
    sharedBy,
    boardName,
    theme,
    dashboard,
}: Props) => {
    const user = useUser()
    const preview = ThemeDashboardPreview(theme)
    const dashboardType = dashboard || 'Chrono'
    const [processingFunction, setProcessingFunction] = useState(false)

    return (
        <div className="board-card">
            <Link to={`/t/${id}`}>
                <div className="board-card__preview">
                    <img src={preview[`${dashboardType}`]} />
                </div>
            </Link>

            <div className="board-card__text-container">
                <div className="board-card__text-container__header-container">
                    <div className="board-card__text-container__top-wrapper">
                        <Heading3
                            className="board-card__text-container__top-wrapper__title"
                            margin="none"
                            as="span"
                        >
                            {boardName}
                        </Heading3>
                    </div>
                </div>

                <div className="board-card__text-container__text">
                    <UserIcon className="board-card__text-container__text__icon" />
                    <span className="board-card__text-container__text__description">
                        {sharedBy} delte denne tavla med deg
                    </span>
                </div>
            </div>
            <div className="button-container">
                <Button
                    variant="primary"
                    className="button__primary"
                    onClick={() => {
                        setProcessingFunction(true)
                        answerBoardInvitation(id, user?.uid ?? '', true).catch(
                            () => setProcessingFunction(false),
                        )
                    }}
                    loading={processingFunction}
                >
                    Legg til i Mine tavler
                </Button>
                <Button
                    variant="secondary"
                    className="button-secondary"
                    onClick={() => {
                        answerBoardInvitation(id, user?.uid ?? '', false)
                    }}
                    disabled={processingFunction}
                >
                    Fjern
                </Button>
            </div>
        </div>
    )
}

interface Props {
    id: string
    boardName: string
    sharedBy: string
    theme: Theme | undefined
    dashboard: string | undefined | void
}

export default SharedBoardCard
