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
    const [
        settings,
        {
            setSettingsAndStore,
            setHiddenStops,
            setHiddenRoutes,
            setHiddenStopModes,
        },
    ] = useSettingsContext()

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
            setHiddenStops([])
        } else {
            setHiddenStops(stops.map(({ id }) => id))
        }
    }, [hiddenStops.length, setHiddenStops, stops])

    const onToggleStop = useCallback(
        (event) => {
            const stopId = event.target.id
            const newDisabledList = toggleValueInList(hiddenStops, stopId)
            setHiddenStops(newDisabledList)
        },
        [hiddenStops, setHiddenStops],
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
            setHiddenRoutes(newHiddenRoutes)
        },
        [hiddenRoutes, setHiddenRoutes],
    )

    const onToggleMode = useCallback(
        (stopPlaceId: string, mode: LegMode): void => {
            console.log(stopPlaceId)
            //console.log(hiddenStopModes[stopPlaceId])
            const newHiddenModes = {
                ...hiddenStopModes,
                [stopPlaceId]: toggleValueInList(
                    hiddenStopModes[stopPlaceId] || [],
                    mode,
                ),
            }
            const stopPlace = filteredStopPlaces.find(
                (item) => item.id === stopPlaceId,
            )

            const uniqueTransportModes = Array.from(
                new Set(stopPlace?.lines.map((line) => line.transportMode)),
            )

            if (
                stopPlace &&
                uniqueTransportModes.length ===
                    newHiddenModes[stopPlaceId].length
            ) {
                const newDisabledList = toggleValueInList(
                    hiddenStops,
                    stopPlaceId,
                )
                // setHiddenStops(X)

                setSettingsAndStore({
                    hiddenStops: newDisabledList,
                    hiddenStopModes: newHiddenModes,
                })
            } else {
                setSettingsAndStore({
                    hiddenStopModes: newHiddenModes,
                })
            }

            // setHiddenModes(X)
        },
        [
            hiddenStopModes,
            filteredStopPlaces,
            setHiddenStopModes,
            hiddenStops,
            setSettingsAndStore,
        ],
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
