import React, { useEffect, useState } from 'react'

import { firestore } from 'firebase'

import ThemeContrastWrapper from '../ThemeWrapper/ThemeContrastWrapper'
import { Theme } from '../../types'

import { useSettingsContext, Settings } from '../../settings'
import { getBoardsOnSnapshot } from '../../services/firebase'
import { useUser } from '../../auth'

import BoardCard from './BoardCard'

import './styles.scss'
import { Heading2 } from '@entur/typography'
import { NoTavlerAvailable, NoAccessToTavler } from '../Error/ErrorPages'

type DocumentData = firestore.DocumentData

const MyBoards = ({ history }: Props): JSX.Element => {
    const [settings] = useSettingsContext()
    const [boards, setBoards] = useState<DocumentData>()
    const user = useUser()

    useEffect(() => {
        if (!user || user.isAnonymous) return
        const unsubscribe = getBoardsOnSnapshot(user.uid, {
            next: (querySnapshot) => {
                const updatedBoards = querySnapshot.docs.map((docSnapshot) => ({
                    data: docSnapshot.data(),
                    lastmodified: docSnapshot.data()['lastmodified'],
                    created: docSnapshot.data()['created'],
                    id: docSnapshot.id,
                }))
                setBoards(updatedBoards)
            },
            error: () => setBoards([]),
        })
        return unsubscribe
    }, [user, setBoards])

    if (!user || user.isAnonymous) return <NoAccessToTavler />
    if (boards == undefined) return null
    if (!boards) return <NoTavlerAvailable history={history} />
    boards.sort((n1: BoardProps, n2: BoardProps) => {
        const n1Date = n1.lastmodified ? n1.lastmodified : n1.created
        const n2Date = n2.lastmodified ? n2.lastmodified : n2.created
        if (n1Date && n2Date) return n2Date.toMillis() - n1Date.toMillis()
        if (!n2Date) return -1
        return 1
    })

    return (
        <ThemeContrastWrapper useContrast={settings?.theme === Theme.DEFAULT}>
            <div className="my-boards">
                <Heading2 className="my-boards__title">
                    Mine tavler ({boards.length})
                </Heading2>
                <div className="my-boards__board-list">
                    {boards.map((board: BoardProps) => (
                        <BoardCard
                            key={board.id}
                            id={board.id}
                            timestamp={board.lastmodified}
                            created={board.created}
                            settings={board.data}
                        />
                    ))}
                </div>
            </div>
        </ThemeContrastWrapper>
    )
}

interface Props {
    history: any
}

interface BoardProps {
    data: Settings
    id: string
    lastmodified: firebase.firestore.Timestamp
    created: firebase.firestore.Timestamp
}

export default MyBoards
