import { RadioGroup, RadioPanel } from '@entur/form'
import { ForwardIcon, SwitchIcon } from '@entur/icons'
import { Dispatch, SetStateAction } from 'react'

function SelectTileType({
    tileType,
    setTileType,
}: {
    tileType: string
    setTileType: Dispatch<SetStateAction<string>>
}) {
    return (
        <RadioGroup
            name="tile-type"
            value={tileType}
            onChange={(e) => {
                setTileType(e.target.value)
            }}
        >
            <div className="flexRow g-2">
                <RadioPanel
                    title=<div className="flexRow g-2">
                        <SwitchIcon />
                        Knutepunkt
                    </div>
                    value="stop_place"
                >
                    Viser alle retninger for et stoppested
                </RadioPanel>
                <RadioPanel
                    title={
                        <div className="flexRow g-2">
                            <ForwardIcon />
                            Stoppested
                        </div>
                    }
                    value="quay"
                >
                    Viser en spesifikk retning for et stoppested
                </RadioPanel>
            </div>
        </RadioGroup>
    )
}
export { SelectTileType }
