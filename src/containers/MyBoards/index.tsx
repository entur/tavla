import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import type { DocumentData, Timestamp } from 'firebase/firestore'

import { Contrast } from '@entur/layout'
import { Heading3 } from '@entur/typography'
import { AddIcon } from '@entur/icons'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@entur/tab'

import { ThemeDashboardPreview } from '../../assets/icons/ThemeDashboardPreview'
import { Settings, useSettingsContext } from '../../settings'
import { getBoardsOnSnapshot } from '../../services/firebase'
import { useUser } from '../../auth'
import { Theme } from '../../types'
import { isDarkOrDefaultTheme } from '../../utils'

import { NoTavlerAvailable, NoAccessToTavler } from '../Error/ErrorPages'
import ThemeContrastWrapper from '../ThemeWrapper/ThemeContrastWrapper'

import BoardCard from './BoardCard'
import './styles.scss'

function sortBoard(boards: BoardProps[]): BoardProps[] {
    return boards.sort((n1: BoardProps, n2: BoardProps) => {
        const n1Date = n1.lastmodified ? n1.lastmodified : n1.created
        const n2Date = n2.lastmodified ? n2.lastmodified : n2.created
        if (n1Date && n2Date) return n2Date.toMillis() - n1Date.toMillis()
        if (!n2Date) return -1
        return 1
    })
}

const MyBoards = ({ history }: Props): JSX.Element | null => {
    const [boards, setBoards] = useState<DocumentData>()
    const user = useUser()
    const preview = ThemeDashboardPreview(Theme.DEFAULT)
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [settings] = useSettingsContext()
    const { theme } = settings || {}

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
                    (docSnapshot: any) =>
                        ({
                            data: docSnapshot.data(),
                            lastmodified: docSnapshot.data().lastmodified,
                            created: docSnapshot.data().created,
                            id: docSnapshot.id,
                        } as BoardProps),
                )
                setBoards(updatedBoards.length ? sortBoard(updatedBoards) : [])
            },
            error: () => setBoards([]),
        })
        return unsubscribe
    }, [user])

    if (boards === undefined || user === undefined) {
        return null
    }
    if (!user || user.isAnonymous) {
        return <NoAccessToTavler />
    }
    if (!boards.length) {
        return <NoTavlerAvailable history={history} />
    }

    return (
        <ThemeContrastWrapper useContrast={isDarkOrDefaultTheme(theme)}>
            <div className="my-boards">
                <Tabs index={currentIndex} onChange={setCurrentIndex}>
                    <TabList>
                        <Tab>Mine Tavler</Tab>
                        <Tab>Delte tavler</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Contrast>
                                <div className="my-boards__board-list">
                                    {boards.map((board: BoardProps) => (
                                        <BoardCard
                                            key={board.id}
                                            id={board.id}
                                            uid={user.uid}
                                            timestamp={board.lastmodified}
                                            created={board.created}
                                            settings={board.data}
                                            history={history}
                                        />
                                    ))}
                                    <Link to="/">
                                        <div className="board-card">
                                            <div
                                                className="board-card__preview"
                                                style={{ position: 'relative' }}
                                            >
                                                <img
                                                    src={preview['Chrono']}
                                                    style={{
                                                        visibility: 'hidden',
                                                    }}
                                                />
                                                <AddIcon
                                                    size="3rem"
                                                    className="board-card__preview__icon"
                                                />
                                            </div>
                                            <div className="board-card__text-container">
                                                <span>
                                                    <Heading3
                                                        className="board-card__text-container__title"
                                                        margin="none"
                                                    >
                                                        Lag ny tavle
                                                    </Heading3>
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </Contrast>
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

interface BoardProps {
    data: Settings
    id: string
    lastmodified: Timestamp
    created: Timestamp
}

export default MyBoards
