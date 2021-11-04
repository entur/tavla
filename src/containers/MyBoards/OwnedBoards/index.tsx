import React from 'react'

import { Link } from 'react-router-dom'

import type { User } from 'firebase/auth'

import type { DocumentData } from 'firebase/firestore'

import { AddIcon } from '@entur/icons'
import { Contrast } from '@entur/layout'
import { Heading3 } from '@entur/typography'

import { Board } from '../../../types'

import BoardCard from './BoardCard'

const OwnedBoards = ({
    boards,
    user,
    preview,
    history,
}: Props): JSX.Element => (
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
                    history={history}
                />
            ))}
            <Link to="/">
                <div className="board-card">
                    <div
                        className="board-card__preview"
                        style={{ position: 'relative' }}
                    >
                        <img
                            src={preview['Chrono']}
                            style={{
                                visibility: 'hidden',
                            }}
                        />
                        <AddIcon
                            size="3rem"
                            className="board-card__preview__icon"
                        />
                    </div>
                    <div className="board-card__text-container">
                        <span>
                            <Heading3
                                className="board-card__text-container__title"
                                margin="none"
                            >
                                Lag ny tavle
                            </Heading3>
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    </Contrast>
)

interface Props {
    boards: DocumentData
    user: User
    preview: {
        [key: string]: any
    }
    history: any
}

export default OwnedBoards
