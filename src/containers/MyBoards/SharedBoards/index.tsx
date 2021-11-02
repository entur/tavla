import React, { useCallback, useEffect, useState } from 'react'

import type { DocumentData, Timestamp } from 'firebase/firestore'

import { Contrast } from '@entur/layout'

import { useUser } from '../../../auth'
import { getEmailByUID } from '../../../services/firebase'
import type { Settings } from '../../../settings'
import { OwnerRequest, Theme } from '../../../types'

import SharedBoardCard from './SharedBoardCard'
import {
    persistMultipleFields,
    persistSingleField,
    removeOwners,
} from '../../../settings/FirestoreStorage'

const SharedBoards = ({ requestedBoards, accept }: Props): JSX.Element => {
    const user = useUser()
    const [requestedBoardsFormated, setRequestedBoardsFormated] =
        useState<SharedBoardProps[]>()

    useEffect(() => {
        const restructureRequestedBoardsData = async () => {
            const filterData: SharedBoardProps[] = requestedBoards.map(
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

            const replaceUIDWithEmail = await Promise.all(
                filterData.map(async (request: SharedBoardProps) => {
                    const sharedByEmail = await (
                        await getEmailByUID(request.sharedBy)
                    ).email
                    return {
                        ...request,
                        sharedBy: sharedByEmail,
                    }
                }),
            )
            setRequestedBoardsFormated(replaceUIDWithEmail)
        }
        restructureRequestedBoardsData()
    }, [requestedBoards, user?.uid])

    // const acceptRequest = (boardId: string) => {
    //     const requestedBoard = requestedBoards.find(
    //         (board: BoardProps) => board.id === boardId,
    //     )
    //     const requestedBoardSettings: Settings = requestedBoard.data
    //     console.log('ownes', requestedBoardSettings)
    //     persistSingleField(requestedBoard.id, 'boardName', 'dritt')
    //     // removeOwners(requestedBoard.id)
    //     // persistMultipleFields(boardId, {
    //     //     ...requestedBoard,
    //     //     owners: user
    //     //         ? [...requestedBoard.owners, user?.uid]
    //     //         : requestedBoard.owners,
    //     //     ownerRequestRecipients: user?.uid
    //     //         ? [
    //     //               ...requestedBoard.ownerRequestRecipients.filter(
    //     //                   (recipient: string) => recipient !== user.uid,
    //     //               ),
    //     //           ]
    //     //         : requestedBoard.ownerRequestRecipients,
    //     //     ownerRequests: user?.uid
    //     //         ? [
    //     //               ...requestedBoard.ownerRequests.filter(
    //     //                   (req: OwnerRequest) => req.recipientUID !== user.uid,
    //     //               ),
    //     //           ]
    //     //         : requestedBoard.ownerRequests,
    //     // })
    // }

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
                            accept={accept}
                        />
                    ))}
            </div>
        </Contrast>
    )
}

interface Props {
    requestedBoards: DocumentData
    accept: CallableFunction
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
