import React, { useCallback } from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { useStopPlaceIds } from 'logic/use-stop-place-ids/useStopPlaceIds'
import { Loader } from 'components/Loader/Loader'
import { DashboardTypes } from 'src/types'
import { Checkbox } from '@entur/form'
import { Paragraph } from '@entur/typography'
import { PanelRow } from './PanelRow/Panelrow'
import classes from './StopPlacePanel.module.scss'

function StopPlacePanel(): JSX.Element {
    const [settings, setSettings] = useSettings()
    const numberOfStations =
        settings.dashboard === DashboardTypes.NewBusStop ? 1 : undefined

    const { stopPlaceIds, loading } = useStopPlaceIds({
        distance: settings.distance,
        filterHidden: false,
        numberOfStations,
    })

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
                hiddenStops: stopPlaceIds,
            })
        }
    }, [
        settings.hiddenStopModes,
        settings.hiddenStops.length,
        setSettings,
        stopPlaceIds,
    ])

    if (loading) {
        return (
            <div className={classes.StopPlacePanel}>
                <Loader />
            </div>
        )
    }

    if (!stopPlaceIds.length) {
        return (
            <div className={classes.StopPlacePanel}>
                <Paragraph>Det er ingen stoppesteder i nærheten.</Paragraph>
            </div>
        )
    }

    return (
        <div className={classes.StopPlacePanel}>
            <div className={classes.Header}>
                {numberOfStations && (
                    <>Kun nærmeste holdeplass vises i denne visningstypen</>
                )}
                <div onClick={(event): void => event.stopPropagation()}>
                    {!numberOfStations && (
                        <Checkbox
                            id="check-all-stop-places"
                            name="check-all-stop-places"
                            onChange={onChooseAllPressed}
                            checked={!settings.hiddenStops.length}
                        >
                            Velg alle
                        </Checkbox>
                    )}
                </div>
            </div>
            {stopPlaceIds.map((stopPlaceId) => (
                <PanelRow stopPlaceId={stopPlaceId} key={stopPlaceId} />
            ))}
        </div>
    )
}

export { StopPlacePanel }
