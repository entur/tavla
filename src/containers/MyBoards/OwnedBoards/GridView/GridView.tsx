import { Link } from 'react-router-dom'
import React from 'react'
import type { DocumentData } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { Contrast } from '@entur/layout'
import { Heading3 } from '@entur/typography'
import { Board } from '../../../../types'
import { BoardCard } from '../BoardCard/BoardCard'
import { AddBoardIcon } from '../../../../assets/icons/AddBoardIcon'
import classes from './GridView.module.scss'

const GridView = ({ boards, user }: Props) => (
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
        <div>
            <Link to="/">
                <div className={classes.AddBoard}>
                    <AddBoardIcon className={classes.AddIcon} />
                </div>
            </Link>
            <Heading3>Lag ny tavle</Heading3>
        </div>
    </Contrast>
)

interface Props {
    boards: DocumentData
    user: User
}

export { GridView }
