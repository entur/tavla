'use client'
import { IconButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { useLines } from 'app/(admin)/edit/[id]/components/TileCard/useLines'
import { TransportIcon } from 'components/TransportIcon'
import classes from '../styles.module.css'
import { TTile } from 'types/tile'
import { uniqBy } from 'lodash'

function TileCard({
    tile,
    onRemove,
}: {
    tile: TTile
    onRemove: (tile: TTile) => void
}) {
    const lines = useLines(tile)
    if (!lines) return <div className={classes.card}>Laster..</div>
    const transportModes = uniqBy(lines, 'transportMode')
        .map((l) => l.transportMode)
        .sort()

    return (
        <div className={classes.card}>
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-row gap-1 h-6">
                    {transportModes.map((tm) => (
                        <TransportIcon transportMode={tm} key={tm} />
                    ))}
                </div>
                {tile.name}
            </div>
            <div className="flex flex-row">
                <IconButton onClick={() => onRemove(tile)}>
                    <DeleteIcon />
                    <span className="ml-2">Fjern</span>
                </IconButton>
            </div>
        </div>
    )
}

export { TileCard }
