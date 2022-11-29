import React, { ChangeEvent, useCallback, useMemo } from 'react'
import { Checkbox, Fieldset } from '@entur/form'
import { Paragraph } from '@entur/typography'
import { getTranslation } from '../../../../utils/utils'
import { useSettings } from '../../../../settings/SettingsProvider'
import { toggleValueInList } from '../../../../utils/array'
import { FormFactor } from '../../../../../graphql-generated/mobility-v2'
import { byName } from '../../../../logic/use-rental-stations/types'
import { useRentalStations } from '../../../../logic/use-rental-stations/useRentalStations'
import './BikePanel.scss'

function BikePanel(): JSX.Element {
    const [settings, setSettings] = useSettings()

    const { rentalStations } = useRentalStations([FormFactor.Bicycle], false)

    const stations = useMemo(
        () => rentalStations.sort(byName),
        [rentalStations],
    )

    const onChooseAllPressed = useCallback(() => {
        if (settings.hiddenStations.length > 0) {
            setSettings({
                hiddenStations: [],
            })
        } else {
            setSettings({
                hiddenStations: stations.map(({ id }) => id),
            })
        }
    }, [settings.hiddenStations.length, setSettings, stations])

    const onToggleStation = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const stationId = event.target.id
            setSettings({
                hiddenStations: toggleValueInList(
                    settings.hiddenStations,
                    stationId,
                ),
            })
        },
        [settings.hiddenStations, setSettings],
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
                checked={!settings.hiddenStations.length}
            >
                Velg alle
            </Checkbox>
            {stations.map(({ name, id }) => (
                <Checkbox
                    key={id}
                    id={id}
                    name={getTranslation(name) || ''}
                    checked={!settings.hiddenStations.includes(id)}
                    onChange={onToggleStation}
                >
                    <span className="bike-panel__eds-paragraph">
                        {getTranslation(name) || ''}
                    </span>
                </Checkbox>
            ))}
        </Fieldset>
    )
}

export { BikePanel }
