import { TTile } from 'types/tile'
import React from 'react'
import { StopPlaceSettings } from '../TileSettings/components/StopPlaceSettings'
import { QuaySettings } from 'Admin/scenarios/TileSettings/components/QuaySettings'

function TilesSettings({ tiles }: { tiles: TTile[] }) {
    return (
        <div>
            {/* Først komponent med liste over holdeplasser. Lagre hvilken som er valgt et sted i denne filen */}
            {/* Under skal det returneres stopplacetile der kun en tile sendes med */}
            {tiles.map((tile) => {
                switch (tile.type) {
                    case 'stop_place':
                        return <StopPlaceSettings key={tile.uuid} tile={tile} />
                    case 'quay':
                        return <QuaySettings key={tile.uuid} tile={tile} />
                    /* hvis ingen tiles skal det vises en melding */
                }
            })}
        </div>
    )
}

export { TilesSettings }
