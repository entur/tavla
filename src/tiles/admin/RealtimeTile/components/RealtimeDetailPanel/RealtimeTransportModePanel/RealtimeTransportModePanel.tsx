import React, { useCallback, useMemo } from 'react'
import { xor } from 'lodash'
import { isTransport } from 'utils/typeguards'
import { TransportModeIcon } from 'components/TransportModeIcon/TransportModeIcon'
import { TransportMode } from 'graphql-generated/journey-planner-v3'
import { useSettings } from 'settings/SettingsProvider'
import { Line } from 'src/types'
import { FilterChip } from '@entur/chip'
import { TravelSwitch } from '@entur/form'
import { ExpandablePanel } from '@entur/expand'
import { transportModeName } from '../transportModeName'
import classes from './RealtimeTransportModePanel.module.scss'

function RealtimeTransportModePanel({
    mode,
    realtimeLines,
}: {
    mode: TransportMode
    realtimeLines: Line[]
}) {
    const [settings, setSettings] = useSettings()

    const filteredLines = useMemo(
        () => realtimeLines.filter((it) => it.transportMode === mode),
        [mode, realtimeLines],
    )

    const toggleRealtimeDataLineById = useCallback(
        (lineId: string) => () => {
            setSettings({
                hiddenRealtimeDataLineRefs: xor(
                    settings.hiddenRealtimeDataLineRefs,
                    [lineId],
                ),
                hideRealtimeData: false,
            })
        },
        [settings.hiddenRealtimeDataLineRefs, setSettings],
    )

    const toggleRealtimeDataLinesByMode = useCallback(() => {
        setSettings({
            hiddenRealtimeDataLineRefs: xor(
                settings.hiddenRealtimeDataLineRefs,
                filteredLines.map((it) => it.id),
            ),
            hideRealtimeData: false,
        })
    }, [settings.hiddenRealtimeDataLineRefs, setSettings, filteredLines])

    return (
        <div className={classes.RealtimeTransportModePanel}>
            <ExpandablePanel
                title={
                    <div className={classes.Title}>
                        <span className={classes.Name}>
                            {transportModeName(mode)}
                        </span>
                        <span onClick={(e) => e.stopPropagation()}>
                            <TravelSwitch
                                transport={isTransport(mode) ? mode : 'bus'}
                                size="large"
                                checked={filteredLines.some(
                                    ({ id }) =>
                                        !settings.hiddenRealtimeDataLineRefs.includes(
                                            id,
                                        ),
                                )}
                                onChange={toggleRealtimeDataLinesByMode}
                            />
                        </span>
                    </div>
                }
            >
                <div className={classes.Lines}>
                    {filteredLines.map(({ id, publicCode, transportMode }) => (
                        <FilterChip
                            className={classes.FilterChip}
                            key={id}
                            value={id}
                            onChange={toggleRealtimeDataLineById(id)}
                            checked={
                                !settings.hiddenRealtimeDataLineRefs.includes(
                                    id,
                                )
                            }
                        >
                            {publicCode}
                            <TransportModeIcon
                                // Icons from eds don't concatenate classes correctly. Adding a ' ' fixes this.
                                className={' ' + classes.TransportIcon}
                                transportMode={transportMode}
                            />
                        </FilterChip>
                    ))}
                </div>
            </ExpandablePanel>
        </div>
    )
}

export { RealtimeTransportModePanel }
