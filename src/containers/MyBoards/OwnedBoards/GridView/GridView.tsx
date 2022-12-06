import { Link } from 'react-router-dom'
import React from 'react'
import type { DocumentData } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { AddIcon } from '@entur/icons'
import { Contrast } from '@entur/layout'
import { Heading3 } from '@entur/typography'
import { Board } from '../../../../types'
import { BoardCard } from '../BoardCard/BoardCard'

const GridView = ({ boards, user, preview }: Props) => (
    <Contrast>
        <div className="my-boards__board-list">
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
            <div className="add-board-card">
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
        </div>
    </Contrast>
)

interface Props {
    boards: DocumentData
    user: User
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preview: Record<string, any>
}

export { GridView }
