import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import type { DocumentData, Timestamp } from 'firebase/firestore'
import { NotificationBadge } from '@entur/layout'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@entur/tab'
import {
    getBoardsForUserOnSnapshot,
    getInvitesForUserOnSnapshot,
    getBoardsByIds,
} from '../../settings/firebase'
import { useUser } from '../../UserProvider'
import { Board, SharedBoard } from '../../types'
import { NoTavlerAvailable, NoAccessToTavler } from '../Error/ErrorPages'
import { ThemeContrastWrapper } from '../ThemeContrastWrapper/ThemeContrastWrapper'
import { Navbar } from '../Navbar/Navbar'
import { SharedBoards } from './SharedBoards/SharedBoards'
import { OwnedBoards } from './OwnedBoards/OwnedBoards'
import './MyBoards.scss'

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

const filterSharedBoards = (boards: SharedBoard[]): SharedBoard[] =>
    boards.filter((board) => !board.isScheduledForDelete)

const MyBoards = (): JSX.Element | null => {
    const [currentIndex, setCurrentIndex] = useState<number>(0)

    const user = useUser()

    const [boards, setBoards] = useState<DocumentData>()
    const [sharedBoards, setSharedBoards] = useState<SharedBoard[]>([])
    const [invites, setInvites] = useState<
        Array<{ id: string; sharedBy: string; timeIssued: Timestamp }>
    >([])

    useEffect(() => {
        if (user === null) {
            setBoards(undefined)
            return
        }
        if (user === undefined) return

        const unsubscribe = getBoardsForUserOnSnapshot(user, {
            next: (querySnapshot) => {
                if (querySnapshot.metadata.hasPendingWrites) return
                const updatedBoards = querySnapshot.docs.map(
                    (docSnapshot: DocumentData): Board => ({
                        data: docSnapshot.data(),
                        lastmodified: docSnapshot.data().lastmodified,
                        created: docSnapshot.data().created,
                        id: docSnapshot.id,
                    }),
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
                    timeIssued: invite.data().timeIssued,
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
        getBoardsByIds(boardInviteIds)
            .then((querySnapshots) => {
                const filteredSnapshots = querySnapshots.filter(
                    (snapshots) =>
                        !snapshots.metadata.hasPendingWrites &&
                        snapshots.data(),
                )

                const boardData: SharedBoard[] = filteredSnapshots.map(
                    (boardSnap) => {
                        const data = boardSnap.data()

                        return {
                            id: boardSnap.id,
                            boardName: data ? data.boardName : '',
                            sharedBy: '',
                            theme: data ? data.theme : '',
                            dashboard: data ? data.dashboard : '',
                            isScheduledForDelete: data
                                ? data.isScheduledForDelete
                                : '',
                        } as SharedBoard
                    },
                )

                const updatedSharedBoards: SharedBoard[] = boardData.map(
                    (board) => {
                        const matchingInviteData = invites.find(
                            (invite) => invite.id === board?.id,
                        )
                        return matchingInviteData
                            ? {
                                  ...board,
                                  sharedBy: matchingInviteData.sharedBy,
                                  timeIssued: matchingInviteData.timeIssued,
                              }
                            : { ...board, sharedBy: 'En ukjent' }
                    },
                )

                setSharedBoards(filterSharedBoards(updatedSharedBoards))
            })
            .catch(() => setSharedBoards([]))
    }, [invites])

    if (boards === undefined || user === undefined || invites === undefined) {
        return null
    }
    if (!user || user.isAnonymous) {
        return <NoAccessToTavler />
    }
    if (!boards.length && !invites.length) {
        return <NoTavlerAvailable />
    }

    return (
        <ThemeContrastWrapper>
            <Helmet>
                <title>Mine tavler - Tavla - Entur</title>
            </Helmet>
            <Navbar />
            <div className="my-boards">
                <Tabs index={currentIndex} onChange={setCurrentIndex}>
                    <TabList>
                        <Tab>Mine tavler</Tab>
                        <Tab>
                            Invitasjoner
                            {sharedBoards.length > 0 ? (
                                <NotificationBadge
                                    variant="info"
                                    style={{ position: 'absolute', top: -10 }}
                                >
                                    {sharedBoards.length}
                                </NotificationBadge>
                            ) : null}
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <OwnedBoards boards={boards} user={user} />
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

export { MyBoards }
