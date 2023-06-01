import React, { useEffect, useState } from 'react'
import {
    TMapTile,
    TQuayTile,
    TStopPlaceTile,
    TTile,
    TTileType,
} from 'types/tile'
import { Dropdown } from '@entur/dropdown'
import { Button } from '@entur/button'
import { fetchItems } from 'utils/index'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { useSettingsDispatch } from 'scenarios/Admin/reducer'
import { QuaysSearchQuery, type TQuaysSearchQuery } from 'graphql/index'
import { fetchQuery } from 'graphql/utils'
import { RadioGroup, RadioPanel } from '@entur/form'
import classes from './styles.module.css'

function AddMapTile({ setTile }: { setTile: (tile: TMapTile) => void }) {
    return (
        <Dropdown
            items={fetchItems}
            debounceTimeout={1000}
            label="Finn stoppested"
            searchable
            clearable
            onChange={(e) => {
                if (e?.value) {
                    setTile({
                        type: 'map',
                        placeId: e.value,
                        uuid: '',
                    })
                }
            }}
        />
    )
}

function AddQuayTile({ setTile }: { setTile: (tile: TQuayTile) => void }) {
    const [stopPlaceId, setStopPlaceId] = useState<string | undefined>()

    const [data, setData] = useState<TQuaysSearchQuery | undefined>(undefined)

    useEffect(() => {
        if (!stopPlaceId) return
        fetchQuery(QuaysSearchQuery, { stopPlaceId }).then(setData)
    }, [stopPlaceId])

    const quays =
        data?.stopPlace?.quays
            ?.filter(isNotNullOrUndefined)
            .map((quay, index) => ({
                value: quay.id,
                label:
                    'Platform ' +
                    [quay.publicCode ?? index + 1, quay.description].join(' '),
            })) || []

    return (
        <div>
            <Dropdown
                items={fetchItems}
                label="Finn stoppested"
                searchable
                clearable
                openOnFocus
                debounceTimeout={500}
                onChange={(e) => setStopPlaceId(e?.value)}
            />

            <Dropdown
                items={() => quays}
                label="Velg plattform"
                disabled={!stopPlaceId}
                onChange={(e) => {
                    if (e?.value) {
                        setTile({
                            type: 'quay',
                            placeId: e.value,
                            uuid: '',
                        })
                    }
                }}
            />
        </div>
    )
}

function AddStopPlaceTile({
    setTile,
}: {
    setTile: (tile: TStopPlaceTile) => void
}) {
    return (
        <Dropdown
            items={fetchItems}
            debounceTimeout={1000}
            label="Finn stoppested"
            searchable
            clearable
            onChange={(e) => {
                if (e?.value) {
                    setTile({
                        type: 'stop_place',
                        placeId: e.value,
                        uuid: '',
                    })
                }
            }}
        />
    )
}

const components: Record<
    TTileType,
    (props: { setTile: (tile: TTile) => void }) => JSX.Element
> = {
    stop_place: AddStopPlaceTile,
    quay: AddQuayTile,
    map: AddMapTile,
}

function AddTile() {
    const [tileType, setTileType] = useState<TTileType>('stop_place')
    const [tile, setTile] = useState<TTile | undefined>()

    const Component = components[tileType]

    const dispatch = useSettingsDispatch()

    return (
        <div className={classes.AddTile}>
            <RadioGroup
                name="tile-type"
                label="Legg til ny rute"
                onChange={(e) => {
                    setTileType(e.target.value as TTileType)
                }}
                value={tileType}
            >
                <div className={classes.RadioCards}>
                    <RadioPanel title="Stoppested" value="stop_place">
                        Rute med alle avganger for et stoppested.
                    </RadioPanel>
                    <RadioPanel title="Plattform" value="quay">
                        Rute med avganger for en valgt platform/retning.
                    </RadioPanel>
                </div>
            </RadioGroup>
            <Component setTile={setTile} />
            {tile && (
                <Button
                    variant="primary"
                    onClick={() => {
                        dispatch({
                            type: 'addTile',
                            tile,
                        })
                    }}
                >
                    Legg til
                </Button>
            )}
        </div>
    )
}

export { AddTile }
