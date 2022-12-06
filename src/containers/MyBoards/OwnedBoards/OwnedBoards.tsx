import React, { useState } from 'react'
import type { User } from 'firebase/auth'
import type { DocumentData } from 'firebase/firestore'
import { SegmentedChoice, SegmentedControl } from '@entur/form'
import { Contrast } from '@entur/layout'
import { GridView } from './GridView/GridView'
import { ListView } from './ListView/ListView'
import classes from './OwnedBoards.module.scss'

const OwnedBoards = ({ boards, user, preview }: Props): JSX.Element => {
    const [chosenBoardView, setChosenBoardView] = useState('grid')

    const ChosenBoardView = (boardView: string) => {
        switch (boardView) {
            case 'grid':
                return (
                    <GridView boards={boards} user={user} preview={preview} />
                )
            case 'list':
                return <ListView boards={boards} />
        }
    }

    return (
        <div>
            <Contrast className={classes.SwitchWrapper}>
                Velg visningstype:
                <SegmentedControl
                    className={classes.Switch}
                    selectedValue={chosenBoardView}
                    onChange={(value) => {
                        setChosenBoardView(value || 'grid')
                    }}
                >
                    <SegmentedChoice value="grid">Rutenett</SegmentedChoice>
                    <SegmentedChoice value="list">Liste</SegmentedChoice>
                </SegmentedControl>
            </Contrast>
            {ChosenBoardView(chosenBoardView)}
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
