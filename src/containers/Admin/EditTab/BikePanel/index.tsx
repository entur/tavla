import React, { useCallback } from 'react'

import { BikeRentalStation } from '@entur/sdk'
import { Checkbox, Fieldset } from '@entur/form'
import { Paragraph } from '@entur/typography'

import { toggleValueInList } from '../../../../utils'
import { useSettingsContext } from '../../../../settings'

import './styles.scss'

function BikePanel(props: Props): JSX.Element {
    const [settings, setSettings] = useSettingsContext()
    const { hiddenStations = [] } = settings || {}

    const { stations } = props

    const onChooseAllPressed = useCallback(() => {
        if (hiddenStations.length > 0) {
            setSettings({
                hiddenStations: [],
            })
        } else {
            setSettings({
                hiddenStations: stations.map(({ id }) => id),
            })
        }
    }, [hiddenStations.length, setSettings, stations])

    const onToggleStation = useCallback(
        (event) => {
            const stationId = event.target.id
            setSettings({
                hiddenStations: toggleValueInList(hiddenStations, stationId),
            })
        },
        [hiddenStations, setSettings],
    )

    if (!stations.length) {
        return (
            <Fieldset className="bike-panel">
                <Paragraph>Det er ingen stasjoner i nærheten.</Paragraph>
            </Fieldset>
        )
    }

    return (
        <Fieldset className="bike-panel">
            <Checkbox
                id="check-all-stop-places-bike"
                name="check-all-stop-places-bike"
                onChange={onChooseAllPressed}
                checked={!hiddenStations.length}
            >
                Velg alle
            </Checkbox>
            {stations.map(({ name, id }) => (
                <Checkbox
                    key={id}
                    id={id}
                    name={name}
                    checked={!hiddenStations.includes(id)}
                    onChange={onToggleStation}
                >
                    <span className="bike-panel__eds-paragraph">{name}</span>
                </Checkbox>
            ))}
        </Fieldset>
    )
}

interface Props {
    stations: BikeRentalStation[]
}

export default BikePanel
