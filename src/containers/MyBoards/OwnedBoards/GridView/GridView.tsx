import { Link } from 'react-router-dom'
import React from 'react'
import type { DocumentData } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { AddIcon } from '@entur/icons'
import { Contrast } from '@entur/layout'
import { Heading3 } from '@entur/typography'
import { Board, Theme } from '../../../../types'
import { BoardCard } from '../BoardCard/BoardCard'
import { ThemeDashboardPreview } from '../../../../assets/icons/ThemeDashboardPreview'
import classes from './GridView.module.scss'

const GridView = ({ boards, user }: Props) => {
    const preview = ThemeDashboardPreview(Theme.DEFAULT)

    return (
        <Contrast className={classes.GridView}>
            {boards.map((board: Board) => (
                <BoardCard
                    key={board.id}
                    id={board.id}
                    uid={user.uid}
                    timestamp={board.lastmodified}
                    created={board.created}
                    settings={board.data}
                />
            ))}
            {/* <div className="add-board-card">
                    <Link to="/">
                        <div className="add-board-card__preview">
                            <img src={preview['Chrono']} alt="" />
                            <AddIcon
                                size="3rem"
                                className="add-board-card__preview__icon"
                            />
                        </div>
                    </Link>
                    <div className="add-board-card__text-container">
                        <span>
                            <Link to="/">
                                <Heading3>Lag ny tavle</Heading3>
                            </Link>
                        </span>
                    </div>
                </div>
            </div> */}
        </Contrast>
    )
}

interface Props {
    boards: DocumentData
    user: User
}

export { GridView }
