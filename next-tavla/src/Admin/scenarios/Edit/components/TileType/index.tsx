import { RadioGroup, RadioPanel } from '@entur/form'
import { ForwardIcon, SwitchIcon } from '@entur/icons'
import { useState } from 'react'
function SelectTileType() {
    const [tileType, setTileType] = useState('stop_place')

    return (
        <RadioGroup
            name="tile-type"
            value={tileType}
            onChange={(e) => {
                setTileType(e.target.value)
            }}
        >
            <div style={{ display: 'flex', gap: '1em' }}>
                <RadioPanel
                    title=<div style={{ display: 'flex', gap: '1em' }}>
                        <SwitchIcon />
                        Knutepunkt
                    </div>
                    value="stop_place"
                >
                    Viser alle retninger for alle stoppesteder
                </RadioPanel>
                <RadioPanel
                    title={
                        <div style={{ display: 'flex', gap: '1em' }}>
                            <ForwardIcon />
                            Enkelt stoppested
                        </div>
                    }
                    value="quay"
                >
                    Viser en spesifikk retning for et spesifikt stoppested
                </RadioPanel>
            </div>
        </RadioGroup>
    )
}
export { SelectTileType }
