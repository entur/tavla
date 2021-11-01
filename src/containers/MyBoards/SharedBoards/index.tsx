import { Contrast } from '@entur/layout'
import { DocumentData, Timestamp } from '@firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useUser } from '../../../auth'
import { getEmailByUID } from '../../../services/firebase'
import { Settings } from '../../../settings'
import { Theme } from '../../../types'
import SharedBoardCard from './SharedBoardCard'

const SharedBoards = ({ requestedBoards }: Props) => {
    const user = useUser()
    const [requestedBoardsFormated, setRequestedBoardsFormated] =
        useState<SharedBoardProps[]>()

    useEffect(() => {
        ;(async () => {
            const res: SharedBoardProps[] = requestedBoards.map(
                (board: BoardProps) => ({
                    id: board.id,
                    boardName: board.data.boardName,
                    sharedBy: board.data.ownerRequests
                        .filter((request) => request.recipientUID === user?.uid)
                        .map((request) => request.requestIssuerUID)[0],
                    theme: board.data.theme,
                    dashboard: board.data.dashboard,
                }),
            )

            const res2 = await Promise.all(
                res.map(async (request: SharedBoardProps) => {
                    const sharedByEmail = await (
                        await getEmailByUID(request.sharedBy)
                    ).email
                    return {
                        ...request,
                        sharedBy: sharedByEmail,
                    }
                }),
            )
            console.log('res:', res2)

            setRequestedBoardsFormated(res2)
        })()
    }, [requestedBoards])

    return (
        <Contrast>
            <div className="my-boards__board-list">
                {requestedBoardsFormated &&
                    requestedBoardsFormated.map((board: SharedBoardProps) => (
                        <SharedBoardCard
                            key={board.id}
                            id={board.id}
                            boardName={board.boardName}
                            sharedBy={board.sharedBy}
                            theme={board.theme}
                            dashboard={board.dashboard}
                        />
                    ))}
            </div>
        </Contrast>
    )
}

interface Props {
    requestedBoards: DocumentData
}

interface BoardProps {
    data: Settings
    id: string
    lastmodified: Timestamp
    created: Timestamp
}

interface SharedBoardProps {
    id: string
    boardName: string
    sharedBy: string
    theme: Theme
    dashboard: string
}

export default SharedBoards
