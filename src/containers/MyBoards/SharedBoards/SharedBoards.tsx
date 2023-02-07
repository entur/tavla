import React from 'react'
import type { SharedBoard } from 'src/types'
import { Contrast } from '@entur/layout'
import { NoSharedTavlerAvailable } from '../../Error/ErrorPages'
import { SharedBoardCard } from './SharedBoardCard/SharedBoardCard'

const SharedBoards = ({ sharedBoards }: Props): JSX.Element => {
    if (!sharedBoards.length) {
        return <NoSharedTavlerAvailable />
    }

    return (
        <Contrast>
            <div className="my-boards__board-list">
                {sharedBoards.map((board: SharedBoard) => (
                    <SharedBoardCard
                        key={board.id}
                        id={board.id}
                        boardName={board.boardName}
                        sharedBy={board.sharedBy}
                        theme={board.theme}
                        dashboard={board.dashboard}
                        timeIssued={board.timeIssued}
                    />
                ))}
            </div>
        </Contrast>
    )
}

interface Props {
    sharedBoards: SharedBoard[]
}

export { SharedBoards }
