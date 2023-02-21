import React, { useCallback } from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { Paragraph } from '@entur/typography'
import { EditTile } from '../EditTile/EditTile'
import { RealtimeDetailPanel } from './RealtimeDetailPanel/RealtimeDetailPanel'

const RealtimeTile: React.FC = () => {
    const [settings, setSettings] = useSettings()

    const handleChange = useCallback(() => {
        setSettings({
            hideRealtimeData: !settings.hideRealtimeData,
        })
    }, [settings, setSettings])

    return (
        <EditTile
            title="Sanntidsposisjoner"
            onChange={handleChange}
            checked={!settings.hideRealtimeData}
        >
            {!settings.hiddenModes.includes('kollektiv') ? (
                <RealtimeDetailPanel />
            ) : (
                <Paragraph>
                    Kollektivdata er skrudd av. Skru det på ved å trykke på
                    knappen øverst til høyre i kollektiv-ruten.
                </Paragraph>
            )}
        </EditTile>
    )
}

export { RealtimeTile }
