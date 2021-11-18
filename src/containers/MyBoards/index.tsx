import React, { useEffect, useState } from 'react'

import type { DocumentData } from 'firebase/firestore'

import { NotificationBadge } from '@entur/layout'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@entur/tab'

import { ThemeDashboardPreview } from '../../assets/icons/ThemeDashboardPreview'
import {
    getBoardsOnSnapshot,
    getInvitesForUserOnSnapshot,
    getBoardsByIdsOnSnapshot,
} from '../../services/firebase'
import { useUser } from '../../auth'
import { Board, SharedBoardProps, Theme } from '../../types'

import { NoTavlerAvailable, NoAccessToTavler } from '../Error/ErrorPages'
import ThemeContrastWrapper from '../ThemeWrapper/ThemeContrastWrapper'

import SharedBoards from './SharedBoards'
import OwnedBoards from './OwnedBoards'

import './styles.scss'

function sortBoard(boards: Board[]): Board[] {
    return boards.sort((n1: Board, n2: Board) => {
        const n1Date = n1.lastmodified ? n1.lastmodified : n1.created
        const n2Date = n2.lastmodified ? n2.lastmodified : n2.created
        if (n1Date && n2Date) return n2Date.toMillis() - n1Date.toMillis()
        if (!n2Date) return -1
        return 1
    })
}

const filterBoards = (boards: Board[]): Board[] =>
    boards.filter((board) => !board.data.isScheduledForDelete)

const MyBoards = ({ history }: Props): JSX.Element | null => {
    const [currentIndex, setCurrentIndex] = useState<number>(0)

    const user = useUser()
    const preview = ThemeDashboardPreview(Theme.DEFAULT)

    const [boards, setBoards] = useState<DocumentData>()
    const [sharedBoards, setSharedBoards] = useState<SharedBoardProps[]>([])
    const [invites, setInvites] = useState<
        Array<{ id: string; sharedBy: string }>
    >([])

    useEffect(() => {
        if (user === null) {
            setBoards(undefined)
            return
        }
        if (user === undefined) return

        const unsubscribe = getBoardsOnSnapshot(user.uid, {
            next: (querySnapshot) => {
                if (querySnapshot.metadata.hasPendingWrites) return
                const updatedBoards = querySnapshot.docs.map(
                    (docSnapshot: DocumentData) =>
                        ({
                            data: docSnapshot.data(),
                            lastmodified: docSnapshot.data().lastmodified,
                            created: docSnapshot.data().created,
                            id: docSnapshot.id,
                        } as Board),
                )
                setBoards(
                    updatedBoards.length
                        ? sortBoard(filterBoards(updatedBoards))
                        : [],
                )
            },
            error: () => setBoards([]),
        })

        const unsubscribeFromInvites = getInvitesForUserOnSnapshot(user.email, {
            next: (querySnapshot) => {
                if (querySnapshot.metadata.hasPendingWrites) return

                const inviteData = querySnapshot.docs.map((invite) => ({
                    id: invite.ref.parent.parent?.id ?? '',
                    sharedBy: invite.data().sender,
                }))

                setInvites(inviteData)
            },
            error: () => setInvites([]),
        })
        return () => {
            unsubscribe()
            unsubscribeFromInvites()
        }
    }, [user])

    useEffect(() => {
        if (!invites.length) {
            setSharedBoards([])
            return
        }
        const boardInviteIds = invites.map((invite) => invite.id)

        const unsubscribeBoardsFromId = getBoardsByIdsOnSnapshot(
            boardInviteIds,
            {
                next: (querySnapshot) => {
                    if (querySnapshot.metadata.hasPendingWrites) return
                    const boardData = querySnapshot.docs.map(
                        (board) =>
                            ({
                                id: board.id,
                                boardName: board.data().boardName,
                                sharedBy: '',
                                theme: board.data().theme,
                                dashboard: board.data().dashboard,
                            } as SharedBoardProps),
                    )
                    const updatedSharedBoards: SharedBoardProps[] =
                        boardData.map((board) => {
                            const matchingInviteData = invites.find(
                                (invite) => invite.id === board.id,
                            )
                            return matchingInviteData
                                ? {
                                      ...board,
                                      sharedBy: matchingInviteData.sharedBy,
                                  }
                                : { ...board, sharedBy: 'En ukjent' }
                        })
                    setSharedBoards(updatedSharedBoards)
                },
                error: () => setSharedBoards([]),
            },
        )

        return () => {
            unsubscribeBoardsFromId()
        }
    }, [invites])

    if (boards === undefined || user === undefined || invites === undefined) {
        return null
    }
    if (!user || user.isAnonymous) {
        return <NoAccessToTavler />
    }
    if (!boards.length && !invites.length) {
        return <NoTavlerAvailable history={history} />
    }

    return (
        <ThemeContrastWrapper>
            <div className="my-boards">
                <Tabs index={currentIndex} onChange={setCurrentIndex}>
                    <TabList>
                        <Tab>Mine tavler</Tab>
                        <Tab>
                            Delt med meg
                            {invites.length > 0 ? (
                                <NotificationBadge
                                    variant="info"
                                    style={{ position: 'absolute', top: -10 }}
                                >
                                    {invites.length}
                                </NotificationBadge>
                            ) : null}
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <OwnedBoards
                                boards={boards}
                                user={user}
                                preview={preview}
                                history={history}
                            />
                        </TabPanel>
                        <TabPanel>
                            <SharedBoards sharedBoards={sharedBoards} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </div>
        </ThemeContrastWrapper>
    )
}

interface Props {
    history: any
}

export default MyBoards
