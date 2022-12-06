import React, { useState } from 'react'
import type { User } from 'firebase/auth'
import type { DocumentData } from 'firebase/firestore'
import { SegmentedChoice, SegmentedControl } from '@entur/form'
import { GridView } from './GridView/GridView'
import { ListView } from './ListView/ListView'

const OwnedBoards = ({ boards, user, preview }: Props): JSX.Element => {
    const [chosenBoardView, setChosenBoardView] = useState('grid')
    return (
        <div>
            <SegmentedControl
                label="halla"
                selectedValue={chosenBoardView}
                onChange={(value) => {
                    setChosenBoardView(value || 'grid')
                }}
            >
                <SegmentedChoice value="grid">Rutenett</SegmentedChoice>
                <SegmentedChoice value="list">Liste</SegmentedChoice>
            </SegmentedControl>
            <GridView boards={boards} user={user} preview={preview} />
            <ListView boards={boards} />
        </div>
    )
}

interface Props {
    boards: DocumentData
    user: User
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    preview: Record<string, any>
}

export { OwnedBoards }
