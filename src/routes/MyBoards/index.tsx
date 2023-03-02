import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useSearchParams } from 'react-router-dom'
import type { DocumentData, Timestamp } from 'firebase/firestore'
import {
    getBoardsForUserOnSnapshot,
    getInvitesForUserOnSnapshot,
    getBoardsByIds,
} from 'settings/firebase'
import { useUser } from 'settings/UserProvider'
import { Board, SharedBoard } from 'src/types'
import { Navbar } from 'scenarios/Navbar'
import { NoAccessToTavler } from 'scenarios/ErrorPages/NoAccessToTavler'
import { NoTavlerAvailable } from 'scenarios/ErrorPages/NoTavlerAvailable'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@entur/tab'
import { Contrast, NotificationBadge } from '@entur/layout'
import { SharedBoards } from './SharedBoards/SharedBoards'
import { OwnedBoards } from './OwnedBoards/OwnedBoards'
import classes from './MyBoards.module.scss'

function sortBoard(boards: Board[]): Board[] {
    return boards.sort((n1: Board, n2: Board) => {
        const n1Date = n1.lastmodified ? n1.lastmodified : n1.created
        const n2Date = n2.lastmodified ? n2.lastmodified : n2.created
        if (n1Date && n2Date) return n2Date.toMillis() - n1Date.toMillis()
        if (!n2Date) return -1
        return 1
    })
}

function filterBoards(boards: Board[]): Board[] {
    return boards.filter((board) => !board.data.isScheduledForDelete)
}

function filterSharedBoards(boards: SharedBoard[]): SharedBoard[] {
    return boards.filter((board) => !board.isScheduledForDelete)
}

function MyBoards() {
    const [searchParams, setSearchParams] = useSearchParams()
    const currentIndex = useMemo(
        () => Number(searchParams.get('tab')) || 0,
        [searchParams],
    )

    const switchTab = useCallback(
        (value: number) => {
            setSearchParams({ tab: value.toString() }, { replace: true })
        },
        [setSearchParams],
    )

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
        <Contrast>
            <Helmet>
                <title>Mine tavler - Tavla - Entur</title>
            </Helmet>
            <Navbar />
            <div className={classes.MyBoards}>
                <Tabs index={currentIndex} onChange={switchTab}>
                    <TabList>
                        <Tab>Tavler</Tab>
                        <Tab>
                            Invitasjoner
                            {sharedBoards.length > 0 ? (
                                <>
                                    {' '}
                                    <NotificationBadge
                                        variant="info"
                                        // Uses inline style as classnames are not applied correctly
                                        style={{ display: 'inline-block' }}
                                    >
                                        {sharedBoards.length}
                                    </NotificationBadge>
                                </>
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
        </Contrast>
    )
}

export { MyBoards }
