import React, { useCallback } from 'react'
import { useSettings } from 'settings/SettingsProvider'
import { AdminTile } from 'components/AdminTile'
import { Paragraph } from '@entur/typography'
import { RealtimeDetailPanel } from './components/RealtimeDetailPanel/RealtimeDetailPanel'

function RealtimeTile() {
    const [settings, setSettings] = useSettings()

    const handleChange = useCallback(() => {
        setSettings({
            hideRealtimeData: !settings.hideRealtimeData,
        })
    }, [settings, setSettings])

    return (
        <AdminTile
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
        </AdminTile>
    )
}

export { RealtimeTile }
