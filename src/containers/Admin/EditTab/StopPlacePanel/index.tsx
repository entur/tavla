import React, { useCallback, useMemo } from 'react'

import { Checkbox } from '@entur/form'
import { LegMode } from '@entur/sdk'
import { Paragraph } from '@entur/typography'

import { toggleValueInList, isDarkOrDefaultTheme } from '../../../../utils'
import { StopPlaceWithLines } from '../../../../types'
import { useSettingsContext } from '../../../../settings'

import ThemeContrastWrapper from '../../../ThemeWrapper/ThemeContrastWrapper'

import PanelRow from './PanelRow'
import './styles.scss'

function StopPlacePanel(props: Props): JSX.Element {
    const [settings, setSettings] = useSettingsContext()

    const {
        hiddenStopModes = {},
        hiddenStops = [],
        hiddenRoutes = {},
    } = settings || {}

    const { stops } = props

    const filteredStopPlaces = useMemo(
        () => stops.filter(({ lines }) => lines.length),
        [stops],
    )

    const onChooseAllPressed = useCallback(() => {
        if (hiddenStops.length > 0) {
            setSettings({
                hiddenStops: [],
            })
        } else {
            setSettings({
                hiddenStops: stops.map(({ id }) => id),
            })
        }
    }, [hiddenStops.length, setSettings, stops])

    const onToggleStop = useCallback(
        (event) => {
            const stopId = event.target.id
            setSettings({
                hiddenStops: toggleValueInList(hiddenStops, stopId),
            })
        },
        [hiddenStops, setSettings],
    )

    const onToggleRoute = useCallback(
        (stopPlaceId: string, routeName: string) => {
            const newHiddenRoutes = {
                ...hiddenRoutes,
                [stopPlaceId]: toggleValueInList(
                    hiddenRoutes[stopPlaceId] || [],
                    routeName,
                ),
            }
            setSettings({
                hiddenRoutes: newHiddenRoutes,
            })
        },
        [hiddenRoutes, setSettings],
    )

    const onToggleMode = useCallback(
        (stopPlaceId: string, mode: LegMode): void => {
            setSettings({
                hiddenStopModes: {
                    ...hiddenStopModes,
                    [stopPlaceId]: toggleValueInList(
                        hiddenStopModes[stopPlaceId] || [],
                        mode,
                    ),
                },
            })
        },
        [hiddenStopModes, setSettings],
    )

    if (!filteredStopPlaces.length) {
        return (
            <div className="stop-place-panel">
                <Paragraph>Det er ingen stoppesteder i nærheten.</Paragraph>
            </div>
        )
    }

    const useContrast = isDarkOrDefaultTheme(settings?.theme)

    return (
        <ThemeContrastWrapper useContrast={useContrast}>
            <div className="stop-place-panel">
                <div className="stop-place-panel__header">
                    <div
                        className="stop-place-panel__checkall"
                        onClick={(event): void => event.stopPropagation()}
                    >
                        <Checkbox
                            id="check-all-stop-places"
                            name="check-all-stop-places"
                            onChange={onChooseAllPressed}
                            checked={!hiddenStops.length}
                        >
                            Velg alle
                        </Checkbox>
                    </div>
                </div>
                {settings
                    ? filteredStopPlaces.map((stopPlace) => (
                          <PanelRow
                              onToggleMode={onToggleMode}
                              onToggleRoute={onToggleRoute}
                              onToggleStop={onToggleStop}
                              stopPlace={stopPlace}
                              settings={settings}
                              key={stopPlace.id}
                          />
                      ))
                    : null}
            </div>
        </ThemeContrastWrapper>
    )
}

interface Props {
    stops: StopPlaceWithLines[]
}

export default StopPlacePanel
