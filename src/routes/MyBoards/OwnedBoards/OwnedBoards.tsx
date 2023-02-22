import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { User } from 'firebase/auth'
import type { DocumentData } from 'firebase/firestore'
import { SegmentedChoice, SegmentedControl } from '@entur/form'
import { Contrast } from '@entur/layout'
import { AddIcon } from '@entur/icons'
import { GridView } from './GridView/GridView'
import { ListView } from './ListView/ListView'
import classes from './OwnedBoards.module.scss'

type BoardViews = 'grid' | 'list'

function OwnedBoards({ boards, user }: { boards: DocumentData; user: User }) {
    const [chosenBoardView, setChosenBoardView] = useState<BoardViews>('grid')

    const ChosenBoardView = (boardView: BoardViews) => {
        switch (boardView) {
            case 'grid':
                return <GridView boards={boards} user={user} />
            case 'list':
                return <ListView boards={boards} user={user} />
        }
    }

    return (
        <div>
            <Contrast className={classes.Header}>
                <div>
                    {chosenBoardView == 'list' && (
                        <Link to="/">
                            <div className={classes.NewBoardWrapper}>
                                <AddIcon />
                                Lag ny tavle
                            </div>
                        </Link>
                    )}
                </div>

                <div className={classes.Wrapper}>
                    Velg visningstype:
                    <SegmentedControl
                        className={classes.Switch}
                        selectedValue={chosenBoardView}
                        onChange={(value) => {
                            if (value) {
                                setChosenBoardView(value as BoardViews)
                            }
                        }}
                    >
                        <SegmentedChoice value="grid">Rutenett</SegmentedChoice>
                        <SegmentedChoice value="list">Liste</SegmentedChoice>
                    </SegmentedControl>
                </div>
            </Contrast>
            {ChosenBoardView(chosenBoardView)}
        </div>
    )
}

export { OwnedBoards }
