import React, { useCallback } from 'react'
import { Checkbox } from '@entur/form'
import { Paragraph } from '@entur/typography'
import { useSettings } from '../../../../../settings/SettingsProvider'
import { useStopPlaceIds } from '../../../../../logic/use-stop-place-ids/useStopPlaceIds'
import { Loader } from '../../../../../components/Loader/Loader'
import { PanelRow } from './PanelRow/Panelrow'
import './StopPlacePanel.scss'

interface StopPlacePanelProps {
    distance: number
}

function StopPlacePanel({ distance }: StopPlacePanelProps): JSX.Element {
    const [settings, setSettings] = useSettings()

    const { stopPlaceIds, loading } = useStopPlaceIds({
        distance,
        filterHidden: false,
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
            <div className="stop-place-panel">
                <Loader />
            </div>
        )
    }

    if (!stopPlaceIds.length) {
        return (
            <div className="stop-place-panel">
                <Paragraph>Det er ingen stoppesteder i nærheten.</Paragraph>
            </div>
        )
    }

    return (
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
            {stopPlaceIds.map((stopPlaceId) => (
                <PanelRow stopPlaceId={stopPlaceId} key={stopPlaceId} />
            ))}
        </div>
    )
}

export { StopPlacePanel }
