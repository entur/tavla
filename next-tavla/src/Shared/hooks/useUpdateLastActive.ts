import { useCallback, useEffect } from 'react'
import { getBoardSettings } from 'utils/firebase'

function useUpdateLastActive(documentId: string) {
    const updateLastActive = useCallback(async () => {
        const settings = await getBoardSettings(documentId)
        const lastActive = settings.meta?.lastActive ?? 0
        const lastActiveDate = new Date(lastActive)
        if (Date.now() - lastActiveDate.getTime() > 1000 * 60 * 60 * 24) {
            const sanitizedSettings = {
                ...settings,
                meta: {
                    ...settings.meta,
                    lastActive: new Date().toString(),
                },
            }

            await fetch(`/api/lastActive`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'documentId ' + documentId,
                },
                body: JSON.stringify(sanitizedSettings),
            })
        }
    }, [documentId])

    useEffect(() => {
        updateLastActive()
        const intervalId = setInterval(updateLastActive, 1000 * 60 * 60) // Runs every hour
        return () => {
            clearInterval(intervalId)
        }
    }, [updateLastActive])
}

export { useUpdateLastActive }
