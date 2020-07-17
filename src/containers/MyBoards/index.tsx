import React, { useEffect, useState } from 'react'

import { firestore } from 'firebase'

import ThemeContrastWrapper from '../ThemeWrapper/ThemeContrastWrapper'
import { Theme } from '../../types'

import { useSettingsContext } from '../../settings'
import { getBoardsOnSnapshot } from '../../services/firebase'
import { useUser } from '../../auth'

import './styles.scss'

type DocumentData = firestore.DocumentData

const MyBoards = ({ history }: Props): JSX.Element => {
    const [settings] = useSettingsContext()
    const [boards, setBoards] = useState<DocumentData>()
    const user = useUser()

    useEffect(() => {
        if (!user || user.isAnonymous) return
        const unsubscribe = getBoardsOnSnapshot(user.uid, {
            next: (querySnapshot) => {
                const updatedBoards = querySnapshot.docs.map((docSnapshot) =>
                    docSnapshot.data(),
                )
                console.log('first: ', querySnapshot)
                setBoards(updatedBoards)
            },
            error: () => console.log('error :('),
        })
        return unsubscribe
    }, [user, setBoards])

    return (
        <ThemeContrastWrapper useContrast={settings?.theme === Theme.DEFAULT}>
            <div className="my-boards"></div>
        </ThemeContrastWrapper>
    )
}

interface Props {
    history: any
}

export default MyBoards
