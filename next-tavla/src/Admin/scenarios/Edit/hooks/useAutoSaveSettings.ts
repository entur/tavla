import { useToast } from '@entur/alert'
import { useCallback, useEffect, useState } from 'react'
import { TSettings } from 'types/settings'
import { setBoardSettings } from 'utils/firebase'

function useAutoSaveSettings(documentId: string, settings: TSettings) {
    const { addToast } = useToast()
    const [prevTilesLength, setPrevTilesLength] = useState(
        settings.tiles.length,
    )

    const saveSettings = useCallback(() => {
        addToast({
            title: 'Lagret!',
            content: 'Innstillingene er lagret',
            variant: 'info',
        })
        setBoardSettings(documentId, settings)
    }, [addToast, documentId, settings])

    useEffect(() => {
        if (settings.tiles.length == prevTilesLength) {
            return
        }
        saveSettings()
        setPrevTilesLength(settings.tiles.length)
    }, [settings.tiles.length, prevTilesLength, saveSettings])

    return saveSettings
}

export { useAutoSaveSettings }
