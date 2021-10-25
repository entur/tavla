import React from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@entur/button'
import { UserIcon } from '@entur/icons'
import { Heading3 } from '@entur/typography'

import { ThemeDashboardPreview } from '../../../assets/icons/ThemeDashboardPreview'
import { Settings } from '../../../settings'
import { useUser } from '../../../auth'
import { persistMultipleFields } from '../../../settings/FirestoreStorage'

function SharedBoardCard({ id, className, settings }: Props): JSX.Element {
    const user = useUser()
    const {
        boardName,
        theme,
        dashboard,
        ownerRequests = [],
        ownerRequestRecipients = [],
        owners = [],
    } = settings || {}

    const preview = ThemeDashboardPreview(theme)
    const dashboardType = dashboard || 'Chrono'

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
                        {`
                            ${
                                ownerRequests?.filter(
                                    (request) =>
                                        request.recipientEmail === user?.email,
                                )[0].requestIssuerEmail
                            }
                        delte denne tavla med deg`}
                    </span>
                </div>
            </div>
            <div className="button-container">
                <Button
                    variant="primary"
                    className="button__primary"
                    onClick={() =>
                        persistMultipleFields(id, {
                            ...settings,
                            owners: user ? [...owners, user?.uid] : owners,
                            ownerRequestRecipients: user?.email
                                ? [
                                      ...ownerRequestRecipients.filter(
                                          (recipient) =>
                                              recipient !== user.email,
                                      ),
                                  ]
                                : ownerRequestRecipients,
                            ownerRequests: user?.email
                                ? [
                                      ...ownerRequests.filter(
                                          (req) =>
                                              req.recipientEmail !== user.email,
                                      ),
                                  ]
                                : ownerRequests,
                        })
                    }
                >
                    Legg til i Mine tavler
                </Button>
                <Button
                    variant="secondary"
                    className="button-secondary"
                    onClick={() =>
                        persistMultipleFields(id, {
                            ...settings,
                            ownerRequestRecipients: user?.email
                                ? [
                                      ...ownerRequestRecipients.filter(
                                          (recipient) =>
                                              recipient !== user.email,
                                      ),
                                  ]
                                : ownerRequestRecipients,
                            ownerRequests: user?.email
                                ? [
                                      ...ownerRequests.filter(
                                          (req) =>
                                              req.recipientEmail !== user.email,
                                      ),
                                  ]
                                : ownerRequests,
                        })
                    }
                >
                    Fjern
                </Button>
            </div>
        </div>
    )
}

interface Props {
    id: string
    className?: string
    settings: Settings
}

export default SharedBoardCard
