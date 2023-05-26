import React, { useEffect, useState } from 'react'
import { TMapTile, TQuayTile, TStopPlaceTile, TTile } from 'types/tile'
import { Dropdown } from '@entur/dropdown'
import { Button } from '@entur/button'
import { fetchItems } from 'utils/index'
import { nanoid } from 'nanoid'
import { isNotNullOrUndefined } from 'utils/typeguards'
import { useSettingsDispatch } from 'scenarios/Admin/reducer'
import { GetQuaysSearchQuery, TGetQuaysSearchQuery } from 'graphql/index'
import { fetchQuery } from 'graphql/utils'

const tileNames: Record<TTileType, string> = {
    map: 'Kart',
    quay: 'Plattform',
    stop_place: 'Stoppested',
}

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
                        uuid: nanoid(),
                    })
                }
            }}
        />
    )
}

function AddQuayTile({ setTile }: { setTile: (tile: TQuayTile) => void }) {
    const [stopPlaceId, setStopPlaceId] = useState<string | undefined>()

    const [data, setData] = useState<TGetQuaysSearchQuery | undefined>(
        undefined,
    )

    useEffect(() => {
        if (!stopPlaceId) return
        fetchQuery(GetQuaysSearchQuery, { stopPlaceId }).then(setData)
    }, [stopPlaceId])

    const quays =
        data?.stopPlace?.quays?.filter(isNotNullOrUndefined).map((quay) => ({
            value: quay.id,
            label: [quay.publicCode, quay.description].join(' '),
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

            {stopPlaceId && (
                <Dropdown
                    items={() => quays}
                    label="Velg plattform"
                    onChange={(e) => {
                        if (e?.value) {
                            setTile({
                                type: 'quay',
                                placeId: e.value,
                                uuid: nanoid(),
                            })
                        }
                    }}
                />
            )}
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
                        uuid: nanoid(),
                    })
                }
            }}
        />
    )
}

type TTileType = TTile['type']

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
        <div>
            <Dropdown
                label="Velg type"
                value={tileType}
                onChange={(e) => {
                    setTile(undefined)
                    if (e) setTileType(e.value as TTileType)
                }}
                items={Object.entries(tileNames).map(([value, label]) => ({
                    label,
                    value,
                }))}
            />
            <Component setTile={setTile} />

            {tile && (
                <Button
                    variant="primary"
                    width="fluid"
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
