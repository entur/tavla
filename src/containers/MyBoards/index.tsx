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
                    id: docSnapshot.id,
                    metadata: docSnapshot.metadata,
                }))
                setBoards(updatedBoards)
            },
            error: () => setBoards([]),
        })
        return unsubscribe
    }, [user, setBoards])

    if (!boards) return null //TODO: Error page

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
}

export default MyBoards
