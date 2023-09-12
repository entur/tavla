import { useCallback, useEffect } from 'react'
import { getBoardSettings } from 'utils/firebase'

function useUpdateLastActive(documentId: string) {
    const updateLastActive = useCallback(async () => {
        const settings = await getBoardSettings(documentId)
        const lastActive = settings.meta?.lastActive ?? 0
        const lastActiveDate = new Date(lastActive)
        if (
            new Date().getTime() - lastActiveDate.getTime() >
            1000 * 60 * 60 * 24
        ) {
            await fetch(`/api/ping/${documentId}`, {
                method: 'POST',
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
