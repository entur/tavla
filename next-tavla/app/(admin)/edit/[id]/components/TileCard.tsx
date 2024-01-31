'use client'
import { BaseExpand } from '@entur/expand'
import classes from './styles.module.css'
import { TTile } from 'types/tile'
import { SecondarySquareButton } from '@entur/button'
import { DeleteIcon, EditIcon, SaveIcon } from '@entur/icons'
import { useState } from 'react'
import { deleteTile } from '../actions'
import { TBoardID } from 'types/settings'

function TileCard({ bid, tile }: { bid: TBoardID; tile: TTile }) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div>
            <div className={classes.card}>
                {tile.name}
                <div className="flexRow g-2">
                    <SecondarySquareButton
                        onClick={async () => {
                            await deleteTile(bid, tile)
                        }}
                    >
                        <DeleteIcon />
                    </SecondarySquareButton>
                    <SecondarySquareButton onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <SaveIcon /> : <EditIcon />}
                    </SecondarySquareButton>
                </div>
            </div>
            <BaseExpand
                style={{ backgroundColor: 'var(--tertiary-background-color)' }}
                open={isOpen}
            >
                {tile.name}
            </BaseExpand>
        </div>
    )
}

export { TileCard }
