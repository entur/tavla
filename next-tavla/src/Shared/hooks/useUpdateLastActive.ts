import { useCallback, useEffect } from 'react'
import { TBoardID } from 'types/settings'

function useUpdateLastActive(documentId: TBoardID | undefined) {
    const updateLastActive = useCallback(async () => {
        await fetch(`/api/ping/${documentId}`, {
            method: 'POST',
        })
    }, [documentId])

    useEffect(() => {
        updateLastActive()
        const intervalId = setInterval(updateLastActive, 1000 * 60 * 60 * 24) // Runs every hour
        return () => {
            clearInterval(intervalId)
        }
    }, [updateLastActive])
}

export { useUpdateLastActive }
