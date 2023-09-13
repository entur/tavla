import { useCallback, useEffect } from 'react'
import { TBoardID } from 'types/settings'
import { getBoard } from 'utils/firebase'

function useUpdateLastActive(documentId: TBoardID) {
    const updateLastActive = useCallback(async () => {
        const board = (await getBoard(documentId)) || undefined
        if (!board) return
        const lastActive = board?.meta?.lastActive ?? 0
        const lastActiveDate = new Date(lastActive).getTime()
        if (Date.now() - lastActiveDate > 1000 * 60 * 60 * 24) {
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
