import React, { useEffect, useState } from 'react'

import type { DocumentData } from 'firebase/firestore'

import { NotificationBadge } from '@entur/layout'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@entur/tab'

import { ThemeDashboardPreview } from '../../assets/icons/ThemeDashboardPreview'
import {
    getBoardsOnSnapshot,
    getSharedBoardsOnSnapshot,
} from '../../services/firebase'
import { useUser } from '../../auth'
import { Board, Theme } from '../../types'

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

const MyBoards = ({ history }: Props): JSX.Element | null => {
    const user = useUser()
    const preview = ThemeDashboardPreview(Theme.DEFAULT)

    const [boards, setBoards] = useState<DocumentData>()
    const [requestedBoards, setRequestedBoards] = useState<DocumentData>()
    const [currentIndex, setCurrentIndex] = useState<number>(0)

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
                setBoards(updatedBoards.length ? sortBoard(updatedBoards) : [])
            },
            error: () => setBoards([]),
        })
        const unsubscribeFromSharedBoards = getSharedBoardsOnSnapshot(
            user.uid,
            {
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
                    setRequestedBoards(
                        updatedBoards.length ? sortBoard(updatedBoards) : [],
                    )
                },
                error: () => setRequestedBoards([]),
            },
        )
        return () => {
            unsubscribe()
            unsubscribeFromSharedBoards()
        }
    }, [user])

    if (
        boards === undefined ||
        user === undefined ||
        requestedBoards === undefined
    ) {
        return null
    }
    if (!user || user.isAnonymous) {
        return <NoAccessToTavler />
    }
    if (!boards.length && !requestedBoards.length) {
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
                            {requestedBoards.length > 0 ? (
                                <NotificationBadge
                                    variant="info"
                                    style={{ position: 'absolute', top: -10 }}
                                >
                                    {requestedBoards.length}
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
                            <SharedBoards requestedBoards={requestedBoards} />
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
