import { TTransportMode } from 'types/graphql-schema'
import { TTile } from 'types/tile'
import { TransportIcon } from 'components/TransportIcon'
import { transportModeNames } from './utils'
import { Checkbox } from '@entur/form'

function TransportModeCheckbox({
    tile,
    transportMode,
}: {
    tile: TTile
    transportMode: TTransportMode | null
}) {
    return (
        <div>
            <div className="flex flex-row gap-4 items-center justify-start font-semibold">
                <TransportIcon
                    transportMode={transportMode}
                    className="w-8 h-8"
                />
                {transportModeNames(transportMode)}
            </div>
            <div className="border-b-tertiary border-b-2 my-2" />
            <div className="flex flex-row items-center">
                <Checkbox
                    defaultChecked={
                        !tile.whitelistedLines ||
                        tile.whitelistedLines.length === 0
                    }
                    onChange={(e) => {
                        document
                            .getElementsByName(`${tile.uuid}-${transportMode}`)
                            .forEach((input) => {
                                if (input instanceof HTMLInputElement)
                                    input.checked = e.currentTarget.checked
                            })
                    }}
                >
                    Velg alle
                </Checkbox>
            </div>
        </div>
    )
}

export { TransportModeCheckbox }
