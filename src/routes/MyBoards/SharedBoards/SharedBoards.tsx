import React from 'react'
import type { SharedBoard } from 'src/types'
import { NoSharedTavlerAvailable } from 'containers/Error/ErrorPages'
import { Contrast } from '@entur/layout'
import { SharedBoardCard } from './SharedBoardCard/SharedBoardCard'

function SharedBoards({ sharedBoards }: { sharedBoards: SharedBoard[] }) {
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

export { SharedBoards }
