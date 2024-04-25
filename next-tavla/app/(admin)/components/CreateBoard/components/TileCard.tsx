'use client'
import { IconButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { useLines } from 'app/(admin)/edit/[id]/components/TileCard/useLines'
import { TransportIcon } from 'components/TransportIcon'
import { TTile } from 'types/tile'
import { uniqBy } from 'lodash'

function TileCard({
    tile,
    onRemove,
}: {
    tile: TTile
    onRemove: (tile: TTile) => void
}) {
    const classes =
        'flex justify-between items-center rounded-[0.5em] border border-[var(--primary-button-color)] mb-2 p-2'
    const lines = useLines(tile)
    if (!lines) return <div className={classes}>Laster..</div>
    const transportModes = uniqBy(lines, 'transportMode')
        .map((l) => l.transportMode)
        .sort()

    return (
        <div className={classes}>
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
