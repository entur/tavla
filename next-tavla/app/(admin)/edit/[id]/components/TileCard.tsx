'use client'
import { BaseExpand } from '@entur/expand'
import classes from './styles.module.css'
import { TTile } from 'types/tile'
import { SecondarySquareButton } from '@entur/button'
import { DeleteIcon, EditIcon, CloseIcon } from '@entur/icons'
import { Suspense, useState } from 'react'
import { deleteTile } from '../actions'
import { TBoardID } from 'types/settings'
import { Heading3 } from '@entur/typography'
import { useLines } from './useLines'

function TileCard({ bid, tile }: { bid: TBoardID; tile: TTile }) {
    const [isOpen, setIsOpen] = useState(false)
    const lines = useLines(tile.type, tile.placeId)
    if (!lines) return null
    return (
        <Suspense>
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
                        <SecondarySquareButton
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <CloseIcon /> : <EditIcon />}
                        </SecondarySquareButton>
                    </div>
                </div>
                <BaseExpand open={isOpen}>
                    <div>
                        <Heading3>Rediger stoppested: {tile.name}</Heading3>
                        {lines.transportMode}
                    </div>
                </BaseExpand>
            </div>
        </Suspense>
    )
}

export { TileCard }
