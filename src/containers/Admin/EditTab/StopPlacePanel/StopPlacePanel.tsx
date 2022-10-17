import React, { ChangeEvent, useCallback, useMemo } from 'react'
import { Checkbox } from '@entur/form'
import { Paragraph } from '@entur/typography'
import { TransportMode } from '@entur/sdk'
import { Loader } from '@entur/loader'
import { toggleValueInList, isDarkOrDefaultTheme } from '../../../../utils'
import { StopPlaceWithLines } from '../../../../types'
import { useSettings } from '../../../../settings/SettingsProvider'
import { ThemeContrastWrapper } from '../../../ThemeWrapper/ThemeContrastWrapper'
import { PanelRow } from './PanelRow/Panelrow'
import './StopPlacePanel.scss'

function StopPlacePanel(props: Props): JSX.Element {
    const [settings, setSettings] = useSettings()

    const {
        hiddenStopModes = {},
        hiddenStops = [],
        hiddenRoutes = {},
    } = settings || {}

    const { stops } = props

    const filteredStopPlaces = useMemo(
        () => stops?.filter(({ lines }) => lines.length) || [],
        [stops],
    )

    const onChooseAllPressed = useCallback(() => {
        if (hiddenStops.length > 0) {
            setSettings({
                hiddenStops: [],
                hiddenStopModes: Object.fromEntries(
                    Object.keys(hiddenStopModes).map((key) => [key, []]),
                ),
            })
        } else {
            setSettings({
                hiddenStops: stops?.map(({ id }) => id) || [],
            })
        }
    }, [hiddenStopModes, hiddenStops.length, setSettings, stops])

    const onToggleStop = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const checked = event.target.checked
            const stopId = event.target.id
            const stopPlace = filteredStopPlaces.find(
                (item) => item.id === stopId,
            )

            const uniqueTransportModes = Array.from(
                new Set(
                    stopPlace?.lines.map(({ transportMode }) => transportMode),
                ),
            )

            setSettings({
                hiddenStops: toggleValueInList(hiddenStops, stopId),
                hiddenStopModes: {
                    ...hiddenStopModes,
                    [stopId]: !checked ? uniqueTransportModes : [],
                },
            })
        },
        [filteredStopPlaces, hiddenStopModes, hiddenStops, setSettings],
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
        (stopPlaceId: string, mode: TransportMode): void => {
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
                new Set(
                    stopPlace?.lines.map(({ transportMode }) => transportMode),
                ),
            )

            const allModesUnchecked =
                uniqueTransportModes.length ===
                newHiddenModes[stopPlaceId]?.length

            if (allModesUnchecked) {
                setSettings({
                    hiddenStops: [...hiddenStops, stopPlaceId],
                    hiddenStopModes: newHiddenModes,
                })
                return
            }

            setSettings({
                hiddenStops: hiddenStops.filter((id) => id !== stopPlaceId),
                hiddenStopModes: newHiddenModes,
            })
        },
        [filteredStopPlaces, hiddenStopModes, hiddenStops, setSettings],
    )

    if (!filteredStopPlaces.length) {
        return (
            <div className="stop-place-panel">
                {stops ? (
                    <Paragraph>Det er ingen stoppesteder i nærheten.</Paragraph>
                ) : (
                    <Loader>Laster...</Loader>
                )}
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
    stops: StopPlaceWithLines[] | undefined
}

export { StopPlacePanel }
