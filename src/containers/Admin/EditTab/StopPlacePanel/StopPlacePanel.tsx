import React, { ChangeEvent, useCallback } from 'react'
import { Checkbox } from '@entur/form'
import { Paragraph } from '@entur/typography'
import { Loader } from '@entur/loader'
import { isDarkOrDefaultTheme } from '../../../../utils/utils'
import { toggleValueInList } from '../../../../utils/array'
import { StopPlaceWithLines } from '../../../../types'
import { useSettings } from '../../../../settings/SettingsProvider'
import { TransportMode } from '../../../../../graphql-generated/journey-planner-v3'
import { ThemeContrastWrapper } from '../../../ThemeContrastWrapper/ThemeContrastWrapper'
import { PanelRow } from './PanelRow/Panelrow'
import './StopPlacePanel.scss'

interface StopPlacePanelProps {
    stops: StopPlaceWithLines[] | undefined
}

function StopPlacePanel({ stops }: StopPlacePanelProps): JSX.Element {
    const [settings, setSettings] = useSettings()

    const onChooseAllPressed = useCallback(() => {
        if (settings.hiddenStops.length > 0) {
            setSettings({
                hiddenStops: [],
                hiddenStopModes: Object.fromEntries(
                    Object.keys(settings.hiddenStopModes).map((key) => [
                        key,
                        [],
                    ]),
                ),
            })
        } else {
            setSettings({
                hiddenStops: stops?.map(({ id }) => id),
            })
        }
    }, [
        settings.hiddenStopModes,
        settings.hiddenStops.length,
        setSettings,
        stops,
    ])

    const onToggleStop = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const checked = event.target.checked
            const stopId = event.target.id
            const stopPlace = stops?.find((item) => item.id === stopId)

            const uniqueTransportModes = Array.from(
                new Set(
                    stopPlace?.lines.map(({ transportMode }) => transportMode),
                ),
            )

            setSettings({
                hiddenStops: toggleValueInList(settings.hiddenStops, stopId),
                hiddenStopModes: {
                    ...settings.hiddenStopModes,
                    [stopId]: !checked ? uniqueTransportModes : [],
                },
            })
        },
        [stops, settings.hiddenStopModes, settings.hiddenStops, setSettings],
    )

    const onToggleRoute = useCallback(
        (stopPlaceId: string, routeName: string) => {
            const newHiddenRoutes = {
                ...settings.hiddenRoutes,
                [stopPlaceId]: toggleValueInList(
                    settings.hiddenRoutes[stopPlaceId] || [],
                    routeName,
                ),
            }
            setSettings({
                hiddenRoutes: newHiddenRoutes,
            })
        },
        [settings.hiddenRoutes, setSettings],
    )

    const onToggleMode = useCallback(
        (stopPlaceId: string, mode: TransportMode): void => {
            const newHiddenModes = {
                ...settings.hiddenStopModes,
                [stopPlaceId]: toggleValueInList(
                    settings.hiddenStopModes[stopPlaceId] || [],
                    mode,
                ),
            }
            const stopPlace = stops?.find((item) => item.id === stopPlaceId)

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
                    hiddenStops: [...settings.hiddenStops, stopPlaceId],
                    hiddenStopModes: newHiddenModes,
                })
                return
            }

            setSettings({
                hiddenStops: settings.hiddenStops.filter(
                    (id) => id !== stopPlaceId,
                ),
                hiddenStopModes: newHiddenModes,
            })
        },
        [stops, settings.hiddenStopModes, settings.hiddenStops, setSettings],
    )

    if (!stops?.length) {
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

    const useContrast = isDarkOrDefaultTheme(settings.theme)

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
                            checked={!settings.hiddenStops.length}
                        >
                            Velg alle
                        </Checkbox>
                    </div>
                </div>
                {settings
                    ? stops?.map((stopPlace) => (
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

export { StopPlacePanel }
