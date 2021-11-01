import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@entur/button'
import { UserIcon } from '@entur/icons'
import { Heading3 } from '@entur/typography'

import { ThemeDashboardPreview } from '../../../../assets/icons/ThemeDashboardPreview'
import { Theme } from '../../../../types'

const SharedBoardCard = ({
    id,
    sharedBy,
    boardName,
    theme,
    dashboard,
}: Props) => {
    const preview = ThemeDashboardPreview(theme)
    const dashboardType = dashboard || 'Chrono'

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
                        {`
                            ${sharedBy}
                        delte denne tavla med deg`}
                    </span>
                </div>
            </div>
            <div className="button-container">
                <Button
                    variant="primary"
                    className="button__primary"
                    onClick={
                        () => {}
                        // persistMultipleFields(id, {
                        //     ...settings,
                        //     owners: user ? [...owners, user?.uid] : owners,
                        //     ownerRequestRecipients: user?.uid
                        //         ? [
                        //               ...ownerRequestRecipients.filter(
                        //                   (recipient) => recipient !== user.uid,
                        //               ),
                        //           ]
                        //         : ownerRequestRecipients,
                        //     ownerRequests: user?.uid
                        //         ? [
                        //               ...ownerRequests.filter(
                        //                   (req) =>
                        //                       req.recipientUID !== user.uid,
                        //               ),
                        //           ]
                        //         : ownerRequests,
                        // })
                    }
                >
                    Legg til i Mine tavler
                </Button>
                <Button
                    variant="secondary"
                    className="button-secondary"
                    onClick={
                        () => {}
                        // persistMultipleFields(id, {
                        //     ...settings,
                        //     ownerRequestRecipients: user?.uid
                        //         ? [
                        //               ...ownerRequestRecipients.filter(
                        //                   (recipient) => recipient !== user.uid,
                        //               ),
                        //           ]
                        //         : ownerRequestRecipients,
                        //     ownerRequests: user?.uid
                        //         ? [
                        //               ...ownerRequests.filter(
                        //                   (req) =>
                        //                       req.recipientUID !== user.uid,
                        //               ),
                        //           ]
                        //         : ownerRequests,
                        // })
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
    boardName: string
    sharedBy: string
    theme: Theme | undefined
    dashboard: string | undefined | void
}

export default SharedBoardCard
